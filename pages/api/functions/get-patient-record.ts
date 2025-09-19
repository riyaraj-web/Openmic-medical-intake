import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Function call received:', req.body);

    const { patientId, parameters } = req.body;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required'
      });
    }

    // In a real implementation, you would:
    // 1. Query your database for the patient record
    // 2. Apply any privacy filters
    // 3. Return relevant information for the call context

    // Mock patient database lookup
    const patientRecord = await getPatientRecord(patientId);

    if (!patientRecord) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Return structured data for the AI agent
    const response = {
      success: true,
      data: {
        patientId: patientRecord.id,
        basicInfo: {
          name: patientRecord.name,
          dateOfBirth: patientRecord.dateOfBirth,
          gender: patientRecord.gender,
          phone: patientRecord.phone
        },
        medicalInfo: {
          allergies: patientRecord.allergies,
          currentMedications: patientRecord.medications,
          medicalHistory: patientRecord.medicalHistory,
          lastVisit: patientRecord.lastVisit,
          primaryPhysician: patientRecord.primaryPhysician
        },
        insuranceInfo: {
          provider: patientRecord.insurance?.provider,
          policyNumber: patientRecord.insurance?.policyNumber,
          groupNumber: patientRecord.insurance?.groupNumber
        },
        emergencyContact: patientRecord.emergencyContact,
        preferences: {
          preferredLanguage: patientRecord.preferredLanguage,
          communicationPreference: patientRecord.communicationPreference
        }
      },
      timestamp: new Date().toISOString()
    };

    console.log('Patient record sent:', response);

    res.status(200).json(response);
  } catch (error) {
    console.error('Function call error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Mock patient database
async function getPatientRecord(patientId: string) {
  // Simulate database lookup
  const mockPatients = {
    'P12345': {
      id: 'P12345',
      name: 'John Doe',
      dateOfBirth: '1985-06-15',
      gender: 'Male',
      phone: '(555) 123-4567',
      allergies: ['Penicillin', 'Shellfish'],
      medications: [
        'Lisinopril 10mg daily',
        'Metformin 500mg twice daily',
        'Atorvastatin 20mg daily'
      ],
      medicalHistory: [
        'Hypertension diagnosed 2020',
        'Type 2 Diabetes diagnosed 2019',
        'High cholesterol'
      ],
      lastVisit: '2023-12-01',
      primaryPhysician: 'Dr. Sarah Johnson',
      insurance: {
        provider: 'Blue Cross Blue Shield',
        policyNumber: 'BC123456789',
        groupNumber: 'GRP001'
      },
      emergencyContact: 'Jane Doe - (555) 123-4567 (Spouse)',
      preferredLanguage: 'English',
      communicationPreference: 'Phone'
    },
    'P67890': {
      id: 'P67890',
      name: 'Mary Smith',
      dateOfBirth: '1992-03-22',
      gender: 'Female',
      phone: '(555) 987-6543',
      allergies: ['Latex', 'Ibuprofen'],
      medications: [
        'Birth control pills',
        'Vitamin D supplement'
      ],
      medicalHistory: [
        'Migraine headaches',
        'Anxiety'
      ],
      lastVisit: '2024-01-10',
      primaryPhysician: 'Dr. Michael Chen',
      insurance: {
        provider: 'Aetna',
        policyNumber: 'AET987654321',
        groupNumber: 'GRP002'
      },
      emergencyContact: 'Robert Smith - (555) 111-2222 (Father)',
      preferredLanguage: 'English',
      communicationPreference: 'Email'
    }
  };

  // Simulate async database operation
  await new Promise(resolve => setTimeout(resolve, 50));
  
  return mockPatients[patientId] || null;
}