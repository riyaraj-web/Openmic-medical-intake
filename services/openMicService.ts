// services/openMicService.ts

interface LogEntry {
  id: number;
  timestamp: string;
  level: 'info' | 'debug' | 'warn' | 'error';
  message: string;
  source: string;
  userId?: string;
}

export const openMicService = {
  getLogs: async (): Promise<LogEntry[]> => {
    try {
      // Simulate fetching logs from a database or external service
      const logs: LogEntry[] = [
        {
          id: 1,
          timestamp: new Date().toISOString(),
          level: 'info',
          message: 'OpenMic service initialized successfully',
          source: 'openmic-service',
          userId: 'system'
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 5000).toISOString(),
          level: 'debug',
          message: 'Audio processing pipeline started',
          source: 'audio-processor',
          userId: 'user123'
        },
        {
          id: 3,
          timestamp: new Date(Date.now() - 10000).toISOString(),
          level: 'warn',
          message: 'High CPU usage detected during transcription',
          source: 'transcription-service',
          userId: 'user456'
        },
        {
          id: 4,
          timestamp: new Date(Date.now() - 15000).toISOString(),
          level: 'error',
          message: 'Failed to connect to external API',
          source: 'external-api',
          userId: 'system'
        }
      ];
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return logs;
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw new Error('Failed to fetch logs from openMicService');
    }
  },

  getStatus: async () => {
    return {
      status: 'running',
      uptime: Date.now(),
      version: '1.0.0',
      lastHealthCheck: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    };
  },

  clearLogs: async (): Promise<{ success: boolean; message: string }> => {
    // Implementation for clearing logs
    return { 
      success: true, 
      message: 'Logs cleared successfully' 
    };
  },

  getLogsByLevel: async (level: string): Promise<LogEntry[]> => {
    const allLogs = await openMicService.getLogs();
    return allLogs.filter(log => log.level === level);
  }
};