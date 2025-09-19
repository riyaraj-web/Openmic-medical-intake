// pages/app/api/logs/[uid]/route.ts
import { openMicService } from "@/services/openMicService";

export async function GET(req: Request) {
  const logs = await openMicService.getLogs();
  return new Response(JSON.stringify(logs), { status: 200 });
}
