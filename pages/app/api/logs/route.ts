import { openMicService } from "../../../src/services/openMicService";
import { helperFunction } from "../../../src/lib/openmic";

export async function GET() {
  try {
    // Await the async getLogs() method
    const logs = await openMicService.getLogs();
    const helper = helperFunction();
    
    return new Response(
      JSON.stringify({ logs, helper }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error in GET /api/logs:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch logs',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}