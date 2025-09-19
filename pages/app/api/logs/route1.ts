import { NextRequest, NextResponse } from 'next/server';
import { openMicService } from '@/lib/openmic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const botUid = searchParams.get('bot_uid');
    
    // Get call logs from OpenMic API
    const openMicLogs = await openMicService.getCallLogs(botUid || undefined);
    
    // Get our processed call logs from post-call webhook
    const response = await fetch(`${request.nextUrl.origin}/api/webhooks/post-call`);
    const webhookLogs = await response.json();
    
    // Combine and format the logs
    const combinedLogs = {
      openmic_logs: openMicLogs,
      processed_logs: webhookLogs.call_logs || [],
      total_calls: (openMicLogs?.length || 0) + (webhookLogs.call_logs?.length || 0)
    };
    
    return NextResponse.json({
      success: true,
      ...combinedLogs
    });
  } catch (error: any) {
    console.error('Error fetching call logs:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}