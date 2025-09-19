import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for call logs (in production, use a database)
let callLogs: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Post-call webhook received:', body);
    
    // Process the call data from OpenMic
    const callLog = {
      id: Date.now().toString(),
      call_id: body.call_id,
      bot_id: body.bot_id,
      caller_number: body.caller_number,
      duration: body.duration,
      status: body.status,
      transcript: body.transcript || body.conversation,
      summary: body.summary,
      function_calls: body.function_calls || [],
      created_at: new Date().toISOString(),
      processed_at: new Date().toISOString()
    };
    
    // Store the call log
    callLogs.push(callLog);
    
    // Process and analyze the call
    const analysis = analyzeCall(callLog);
    
    // Update call log with analysis
    callLog.analysis = analysis;
    
    // In a real application, you might:
    // 1. Save to database
    // 2. Send notifications
    // 3. Schedule follow-up appointments
    // 4. Update patient records
    // 5. Generate reports
    
    const responseData = {
      success: true,
      call_id: callLog.call_id,
      processed: true,
      analysis: analysis,
      next_steps: generateNextSteps(analysis),
      timestamp: new Date().toISOString()
    };

    console.log('Post-call response:', responseData);
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Post-call webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve call logs
export async function GET() {
  return NextResponse.json({
    success: true,
    total_calls: callLogs.length,
    call_logs: callLogs.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  });
}

function analyzeCall(callLog: any) {
  const transcript = callLog.transcript || '';
  const functionCalls = callLog.function_calls || [];
  
  return {
    call_type: determineCallType(transcript),
    patient_identified: functionCalls.some((fc: any) => fc.success),
    information_collected: extractInformationCollected(transcript),
    sentiment: analyzeSentiment(transcript),
    urgency_level: determineUrgency(transcript),
    completion_status: transcript.includes('appointment') ? 'appointment_scheduled' : 'information_collected'
  };
}

function determineCallType(transcript: string): string {
  if (transcript.toLowerCase().includes('appointment')) return 'appointment_scheduling';
  if (transcript.toLowerCase().includes('emergency')) return 'emergency_intake';
  if (transcript.toLowerCase().includes('prescription')) return 'prescription_inquiry';
  return 'general_intake';
}

function extractInformationCollected(transcript: string): string[] {
  const info = [];
  if (transcript.toLowerCase().includes('medical id')) info.push('medical_id');
  if (transcript.toLowerCase().includes('symptom')) info.push('symptoms');
  if (transcript.toLowerCase().includes('allerg')) info.push('allergies');
  if (transcript.toLowerCase().includes('medication')) info.push('medications');
  if (transcript.toLowerCase().includes('insurance')) info.push('insurance');
  return info;
}

function analyzeSentiment(transcript: string): 'positive' | 'neutral' | 'negative' {
  const positiveWords = ['thank', 'good', 'help', 'great', 'yes'];
  const negativeWords = ['no', 'bad', 'terrible', 'pain', 'emergency', 'urgent'];
  
  const words = transcript.toLowerCase().split(/\s+/);
  const positiveCount = words.filter(word => 
    positiveWords.some(pw => word.includes(pw))
  ).length;
  const negativeCount = words.filter(word => 
    negativeWords.some(nw => word.includes(nw))
  ).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

function determineUrgency(transcript: string): 'low' | 'medium' | 'high' {
  const urgentWords = ['emergency', 'urgent', 'pain', 'bleeding', 'chest pain'];
  const mediumWords = ['appointment', 'soon', 'today'];
  
  const lowerTranscript = transcript.toLowerCase();
  
  if (urgentWords.some(word => lowerTranscript.includes(word))) return 'high';
  if (mediumWords.some(word => lowerTranscript.includes(word))) return 'medium';
  return 'low';
}

function generateNextSteps(analysis: any): string[] {
  const steps = [];
  
  if (analysis.urgency_level === 'high') {
    steps.push('Contact patient immediately');
    steps.push('Schedule emergency appointment');
  } else if (analysis.urgency_level === 'medium') {
    steps.push('Schedule appointment within 24 hours');
  } else {
    steps.push('Schedule routine appointment');
  }
  
  if (!analysis.patient_identified) {
    steps.push('Verify patient identity');
    steps.push('Create new patient record if needed');
  }
  
  if (analysis.call_type === 'prescription_inquiry') {
    steps.push('Review prescription request');
    steps.push('Contact prescribing physician');
  }
  
  steps.push('Send confirmation message to patient');
  
  return steps;
}