import { NextRequest, NextResponse } from 'next/server';

// Mock patient database
const patientsDb = {
  'P001': {
    id: 'P001',
    name: 'John Doe',
    phone: '+1234567890',
    lastVisit: '2024-01-15',
    allergies: ['Penicillin', 'Shellfish'],
    conditions: ['Hypertension', 'Diabetes Type 2'],
    emergencyContact: 'Jane Doe - +1234567891'
  },
  'P002': {
    id: 'P002', 
    name: 'Sarah Smith',
    phone: '+1987654321',
    lastVisit: '2024-02-10',
    allergies: ['None'],
    conditions: ['Asthma'],
    emergencyContact: 'Mike Smith - +1987654322'
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Pre-call webhook received:', body);
    
    // Extract caller information from OpenMic
    const callerPhone = body.caller_number || body.phone;
    
    // Find patient by phone number
    const patient = Object.values(patientsDb).find(p => p.phone === callerPhone);
    
    const responseData = {
      success: true,
      patient_data: patient || {
        message: 'New patient - please collect basic information'
      },
      instructions: patient ? 
        `Patient ${patient.name} found. Last visit: ${patient.lastVisit}. Known allergies: ${patient.allergies.join(', ')}` :
        'New patient intake required. Please collect full medical history.',
      timestamp: new Date().toISOString()
    };

    console.log('Pre-call response:', responseData);
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Pre-call webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}