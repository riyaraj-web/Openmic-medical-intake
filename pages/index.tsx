import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Phone, Eye, RefreshCw, Bot, Activity, FileText } from 'lucide-react';

const MedicalIntakeAgent = () => {
  const [bots, setBots] = useState([]);
  const [callLogs, setCallLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('bots');
  const [selectedBot, setSelectedBot] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Mock data for demonstration
  const mockBots = [
    {
      id: 'bot_123',
      name: 'Medical Intake Assistant',
      domain: 'Medical',
      status: 'active',
      created: '2024-01-15',
      calls: 23
    }
  ];
  
  const mockCallLogs = [
    {
      id: 'call_001',
      botId: 'bot_123',
      patientId: 'P12345',
      patientName: 'John Doe',
      duration: '5:23',
      timestamp: '2024-01-20 10:30:00',
      status: 'completed',
      summary: 'Intake for annual checkup - collected symptoms and medical history',
      transcript: 'Agent: Hello, I am your medical intake assistant...',
      preCallData: { allergies: 'Penicillin', lastVisit: '2023-12-01' },
      functionCalls: [{ type: 'getPatientRecord', patientId: 'P12345', response: 'Patient data retrieved' }]
    }
  ];

  useEffect(() => {
    setBots(mockBots);
    setCallLogs(mockCallLogs);
  }, []);

  const [newBot, setNewBot] = useState({
    name: '',
    domain: 'Medical',
    prompt: `You are a medical intake assistant. Your role is to:
1. Greet patients warmly and professionally
2. Ask for their Patient ID
3. Collect their current symptoms and concerns
4. Review their medical history
5. Schedule follow-up if needed

Always be empathetic and maintain patient confidentiality.`
  });

  const handleCreateBot = async () => {
    setLoading(true);
    try {
      const botData = {
        id: `bot_${Date.now()}`,
        ...newBot,
        status: 'active',
        created: new Date().toISOString().split('T')[0],
        calls: 0
      };
      setBots([...bots, botData]);
      setNewBot({ name: '', domain: 'Medical', prompt: newBot.prompt });
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating bot:', error);
    }
    setLoading(false);
  };

  const handleDeleteBot = async (botId) => {
    setLoading(true);
    try {
      setBots(bots.filter(bot => bot.id !== botId));
    } catch (error) {
      console.error('Error deleting bot:', error);
    }
    setLoading(false);
  };

  const BotManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Bot Management</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Create Bot
        </button>
      </div>

      {isCreating && (
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Create New Bot</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bot Name
              </label>
              <input
                type="text"
                value={newBot.name}
                onChange={(e) => setNewBot({...newBot, name: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Medical Intake Assistant"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domain
              </label>
              <select
                value={newBot.domain}
                onChange={(e) => setNewBot({...newBot, domain: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="Medical">Medical</option>
                <option value="Legal">Legal</option>
                <option value="Receptionist">Receptionist</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent Prompt
            </label>
            <textarea
              value={newBot.prompt}
              onChange={(e) => setNewBot({...newBot, prompt: e.target.value})}
              rows={8}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCreateBot}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Bot'}
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {bots.map((bot) => (
          <div key={bot.id} className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="text-blue-600" size={20} />
                  <h3 className="text-lg font-semibold">{bot.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    bot.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {bot.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Domain:</strong> {bot.domain}</p>
                  <p><strong>Bot UID:</strong> {bot.id}</p>
                  <p><strong>Created:</strong> {bot.created}</p>
                  <p><strong>Total Calls:</strong> {bot.calls}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedBot(bot)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  title="View Details"
                >
                  <Eye size={18} />
                </button>
                <button 
                  onClick={() => {/* Edit functionality */}}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                  title="Edit"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => handleDeleteBot(bot.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const CallLogs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Call Logs & History</h2>
        <button
          onClick={() => setCallLogs([...mockCallLogs])}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <RefreshCw size={20} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4">
        {callLogs.map((call) => (
          <div key={call.id} className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Phone className="text-green-600" size={20} />
                <h3 className="text-lg font-semibold">Call #{call.id}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  call.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {call.status}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {call.timestamp}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <p><strong>Patient:</strong> {call.patientName} ({call.patientId})</p>
                <p><strong>Duration:</strong> {call.duration}</p>
                <p><strong>Bot Used:</strong> {call.botId}</p>
              </div>
              <div>
                <p><strong>Summary:</strong></p>
                <p className="text-sm text-gray-600">{call.summary}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Pre-Call Data</h4>
                  <div className="bg-blue-50 p-3 rounded">
                    <pre className="text-xs">{JSON.stringify(call.preCallData, null, 2)}</pre>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Function Calls</h4>
                  <div className="bg-green-50 p-3 rounded">
                    {call.functionCalls.map((fc, idx) => (
                      <div key={idx} className="text-xs mb-1">
                        <strong>{fc.type}:</strong> {fc.response}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Transcript</h4>
                  <div className="bg-gray-50 p-3 rounded max-h-20 overflow-y-auto">
                    <p className="text-xs">{call.transcript}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const WebhookEndpoints = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Webhook Endpoints</h2>
      
      <div className="grid gap-6">
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">Pre-Call Webhook</h3>
          <div className="space-y-3">
            <p><strong>Endpoint:</strong> <code className="bg-gray-100 px-2 py-1 rounded">POST /api/webhooks/pre-call</code></p>
            <p><strong>Purpose:</strong> Fetches patient data before the call starts</p>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm font-medium mb-2">Example Response:</p>
              <pre className="text-xs">{JSON.stringify({
                patientId: "P12345",
                name: "John Doe",
                allergies: ["Penicillin", "Shellfish"],
                lastVisit: "2023-12-01",
                medications: ["Lisinopril", "Metformin"]
              }, null, 2)}</pre>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-green-600">In-Call Function</h3>
          <div className="space-y-3">
            <p><strong>Endpoint:</strong> <code className="bg-gray-100 px-2 py-1 rounded">POST /api/functions/get-patient-record</code></p>
            <p><strong>Purpose:</strong> Retrieves patient details during the active call</p>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm font-medium mb-2">Example Response:</p>
              <pre className="text-xs">{JSON.stringify({
                status: "success",
                data: {
                  patientId: "P12345",
                  medicalHistory: "Hypertension, Type 2 Diabetes",
                  currentMedications: ["Lisinopril 10mg", "Metformin 500mg"],
                  allergies: ["Penicillin", "Shellfish"],
                  emergencyContact: "Jane Doe - (555) 123-4567"
                }
              }, null, 2)}</pre>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-purple-600">Post-Call Webhook</h3>
          <div className="space-y-3">
            <p><strong>Endpoint:</strong> <code className="bg-gray-100 px-2 py-1 rounded">POST /api/webhooks/post-call</code></p>
            <p><strong>Purpose:</strong> Processes call results and transcript after call ends</p>
            <div className="bg-purple-50 p-4 rounded">
              <p className="text-sm font-medium mb-2">Receives Data:</p>
              <pre className="text-xs">{JSON.stringify({
                callId: "call_001",
                duration: "5:23",
                transcript: "Full conversation transcript...",
                summary: "Patient symptoms and follow-up needed",
                nextSteps: ["Schedule follow-up", "Lab work ordered"]
              }, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Intake Agent Dashboard</h1>
          <p className="text-gray-600">Manage your OpenMic AI bots, view call logs, and monitor webhook integrations</p>
        </div>

        <div className="flex space-x-1 mb-6 bg-white p-1 rounded-lg border">
          <button
            onClick={() => setActiveTab('bots')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'bots' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Bot size={16} />
            Bot Management
          </button>
          <button
            onClick={() => setActiveTab('calls')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'calls' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Activity size={16} />
            Call Logs
          </button>
          <button
            onClick={() => setActiveTab('webhooks')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'webhooks' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText size={16} />
            Webhook Docs
          </button>
        </div>

        <div>
          {activeTab === 'bots' && <BotManagement />}
          {activeTab === 'calls' && <CallLogs />}
          {activeTab === 'webhooks' && <WebhookEndpoints />}
        </div>
      </div>
    </div>
  );
};

export default MedicalIntakeAgent;
