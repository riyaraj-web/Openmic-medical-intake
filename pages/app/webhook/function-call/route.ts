import { NextRequest, NextResponse } from 'next/server';

// Extended patient database with detailed medical records
const medicalRecords = {
  'P001': {
    id: 'P001',
    name: 'John Doe',
    dob: '1975-03-15',
    allergies: ['Penicillin', 'Shellfish'],
    medications: ['Metformin 500mg', 'Lisinopril 10mg'],
    conditions: ['Hypertension', 'Diabetes Type 2'],
    lastVisit: '2024-01-15',
    vitals: {
      bloodPressure: '140/90',
      heartRate: '72 bpm',
      weight: '180 lbs'
    },
    insuranceInfo: {
      provider: 'Blue Cross',
      policyNumber: 'BC123456789'
    },
    emergencyContact: {
      name: 'Jane Doe',
      phone: '+1234567891',
      relationship: 'Spouse'
    }
  },
  'P002': {
    id: 'P002',
    name: 'Sarah Smith', 
    dob: '1988-07-22',
    allergies: ['None known'],
    medications: ['Albuterol inhaler PRN'],
    conditions: ['Asthma'],
    lastVisit: '2024-02-10',
    vitals: {
      bloodPressure: '120/80',
      heartRate: '68 bpm', 
      weight: '135 lbs'
    },
    insuranceInfo: {
      provider: 'Aetna',
      policyNumber: 'AE987654321'
    },
    emergencyContact: {
      name: 'Mike Smith',
      phone: '+1987654322', 
      relationship: 'Husband'
    }
  },
  'P003': {
    id: 'P003',
    name: 'Robert Johnson',
    dob: '1965-11-08',
    allergies: ['Latex', 'Aspirin'],
    medications: ['None'],
    conditions: ['Healthy'],
    lastVisit: 'Never',
    vitals: null,
    insuranceInfo: {
      provider: 'Medicare',
      policyNumber: 'MC445566778'
    },
    emergencyContact: {
      name: 'Mary Johnson',
      phone: '+1555666777',
      relationship: 'Wife'
    }
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Function call webhook received:', body);
    
    // Extract the medical ID from the function call
    const medicalId = body.parameters?.medical_id || body.medical_id;
    
    if (!medicalId) {
      return NextResponse.json({
        success: false,
        error: 'Medical ID is required',
        message: 'Please provide a valid medical ID to retrieve patient information.'
      });
    }

    // Look up patient record
    const patientRecord = medicalRecords[medicalId as keyof typeof medicalRecords];
    
    if (!patientRecord) {
      return NextResponse.json({
        success: false,
        error: 'Patient not found',
        message: `No patient record found for Medical ID: ${medicalId}. Please verify the ID and try again.`
      });
    }

    // Return patient data for the AI agent
    const responseData = {
      success: true,
      patient: patientRecord,
      summary: `Patient ${patientRecord.name} found. ` +
               `DOB: ${patientRecord.dob}. ` +
               `Known allergies: ${patientRecord.allergies.join(', ')}. ` +
               `Current conditions: ${patientRecord.conditions.join(', ')}. ` +
               `Last visit: ${patientRecord.lastVisit}. ` +
               `Insurance: ${patientRecord.insuranceInfo.provider}.`,
      timestamp: new Date().toISOString()
    };

    console.log('Function call response:', responseData);
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Function call webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Also handle GET requests for testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const medicalId = searchParams.get('medical_id');
  
  if (!medicalId) {
    return NextResponse.json({
      available_patients: Object.keys(medicalRecords),
      message: 'Add ?medical_id=P001 to test with a specific patient'
    });
  }
  
  const patientRecord = medicalRecords[medicalId as keyof typeof medicalRecords];
  
  return NextResponse.json({
    success: !!patientRecord,
    patient: patientRecord || null,
    message: patientRecord ? 'Patient found' : 'Patient not found'
  });
}