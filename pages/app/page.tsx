'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Phone, User } from 'lucide-react';

interface Bot {
  id: string;
  name: string;
  prompt: string;
  voice: string;
  language: string;
}

interface CallLog {
  id: string;
  bot_id: string;
  patient_id: string;
  timestamp: string;
  duration: number;
  outcome: string;
  summary: string;
}

export default function MedicalIntakeApp() {
  const [activeTab, setActiveTab] = useState<'bots' | 'calls'>('bots');
  const [bots, setBots] = useState<Bot[]>([]);
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [showBotForm, setShowBotForm] = useState(false);

  useEffect(() => {
    fetchBots();
    fetchCallLogs();
  }, []);

  const fetchBots = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/bots');
      const data = await response.json();
      if (data.success) {
        setBots(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching bots:', error);
    }
    setLoading(false);
  };

  const fetchCallLogs = async () => {
    // Mock data
    const mockCalls: CallLog[] = [
      {
        id: 'call_001',
        bot_id: 'bot_123',
        patient_id: 'MED001',
        timestamp: '2024-09-19T10:30:00Z',
        duration: 240,
        outcome: 'appointment_scheduled',
        summary: 'Patient John Smith called for routine checkup. Appointment scheduled for next week.',
      },
      {
        id: 'call_002',
        bot_id: 'bot_123',
        patient_id: 'MED002',
        timestamp: '2024-09-19T14:15:00Z',
        duration: 180,
        outcome: 'follow_up_required',
        summary: 'Maria Rodriguez called about asthma symptoms. Follow-up call needed.',
      },
    ];
    setCalls(mockCalls);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Medical Intake Agent</h1>
            </div>
            <div className="text-sm text-gray-500">OpenMic API Integration Demo</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('bots')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bots'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Bot Management
            </button>
            <button
              onClick={() => setActiveTab('calls')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'calls'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Call Logs
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {activeTab === 'bots' && (
          <BotManager
            bots={bots}
            loading={loading}
            selectedBot={selectedBot}
            setSelectedBot={setSelectedBot}
            showForm={showBotForm}
            setShowForm={setShowBotForm}
          />
        )}
        {activeTab === 'calls' && <CallLogs calls={calls} />}
      </div>
    </div>
  );
}

// Props typing for components
interface BotManagerProps {
  bots: Bot[];
  loading: boolean;
  selectedBot: Bot | null;
  setSelectedBot: (bot: Bot | null) => void;
  showForm: boolean;
  setShowForm: (v: boolean) => void;
}

function BotManager({ bots, loading }: BotManagerProps) {
  if (loading) return <div>Loading...</div>;
  return (
    <div className="bg-white rounded-lg shadow">
      {bots.length === 0 ? <p>No bots yet</p> : <p>Bots loaded</p>}
    </div>
  );
}

function CallLogs({ calls }: { calls: CallLog[] }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Call Logs</h2>
      {calls.map((c) => (
        <div key={c.id}>{c.summary}</div>
      ))}
    </div>
  );
}
