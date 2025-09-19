// src/components/midcalldashboard.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Clock, 
  User, 
  Activity,
  AlertTriangle,
  CheckCircle,
  FileText,
  Settings,
  Zap
} from 'lucide-react';

interface ActiveCall {
  id: string;
  bot_id: string;
  patient_id?: string;
  patient_name?: string;
  start_time: string;
  status: 'ringing' | 'active' | 'on_hold' | 'ended';
  duration: number;
  phone_number?: string;
  current_step?: string;
  urgency_level?: 'low' | 'medium' | 'high';
  collected_info?: {
    [key: string]: any;
  };
  function_calls?: Array<{
    function_name: string;
    timestamp: string;
    status: 'pending' | 'completed' | 'failed';
    response?: any;
  }>;
  live_transcript?: string[];
}

interface MidCallDashboardProps {
  activeCalls?: ActiveCall[];
  onEndCall?: (callId: string) => void;
  onTransferCall?: (callId: string, destination: string) => void;
}

const MidCallDashboard: React.FC<MidCallDashboardProps> = ({
  activeCalls = [],
  onEndCall,
  onTransferCall
}) => {
  const [selectedCall, setSelectedCall] = useState<ActiveCall | null>(null);
  const [mockCalls, setMockCalls] = useState<ActiveCall[]>([]);
  const [showTranscript, setShowTranscript] = useState(false);

  // Mock active calls for demonstration
  useEffect(() => {
    if (activeCalls.length === 0) {
      const mockData: ActiveCall[] = [
        {
          id: 'call_active_001',
          bot_id: 'bot_med_001',
          patient_id: 'MED001',
          patient_name: 'John Smith',
          start_time: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
          status: 'active',
          duration: 120,
          phone_number: '+1-555-0123',
          current_step: 'Gathering medical history',
          urgency_level: 'medium',
          collected_info: {
            reason_for_call: 'Routine checkup',
            pain_level: 3,
            symptoms: ['mild headache', 'fatigue'],
            medications: ['Lisinopril', 'Metformin']
          },
          function_calls: [
            {
              function_name: 'get_patient_info',
              timestamp: new Date(Date.now() - 90000).toISOString(),
              status: 'completed',
              response: { patient_found: true, last_visit: '2024-08-15' }
            },
            {
              function_name: 'check_appointment_slots',
              timestamp: new Date(Date.now() - 30000).toISOString(),
              status: 'pending'
            }
          ],
          live_transcript: [
            'Bot: Hello, thank you for calling. I\'m your medical intake assistant.',
            'Patient: Hi, I\'d like to schedule a routine checkup.',
            'Bot: I\'d be happy to help you with that. Can you please provide your medical ID?',
            'Patient: Yes, it\'s MED001.',
            'Bot: Thank you, John. I see you\'re in our system. How are you feeling today?',
            'Patient: I\'ve been having some mild headaches and feeling a bit tired lately.'
          ]
        },
        {
          id: 'call_active_002',
          bot_id: 'bot_med_001',
          patient_id: 'MED002',
          patient_name: 'Maria Rodriguez',
          start_time: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
          status: 'active',
          duration: 300,
          phone_number: '+1-555-0125',
          current_step: 'Scheduling appointment',
          urgency_level: 'high',
          collected_info: {
            reason_for_call: 'Asthma emergency',
            pain_level: 8,
            symptoms: ['severe breathing difficulty', 'chest tightness'],
            emergency: true
          },
          function_calls: [
            {
              function_name: 'get_patient_info',
              timestamp: new Date(Date.now() - 270000).toISOString(),
              status: 'completed',
              response: { patient_found: true, allergies: ['Shellfish'] }
            },
            {
              function_name: 'check_emergency_protocols',
              timestamp: new Date(Date.now() - 240000).toISOString(),
              status: 'completed',
              response: { emergency_level: 'high', recommend_911: true }
            }
          ],
          live_transcript: [
            'Bot: Hello, this is your medical intake assistant. How can I help you today?',
            'Patient: I\'m having trouble breathing, it\'s really bad.',
            'Bot: I understand this is urgent. Can you tell me your medical ID so I can access your information quickly?',
            'Patient: MED002, Maria Rodriguez.',
            'Bot: Maria, I see you have asthma. On a scale of 1-10, how would you rate your breathing difficulty?',
            'Patient: It\'s an 8, maybe 9. I can barely breathe.'
          ]
        }
      ];
      setMockCalls(mockData);
    }
  }, [activeCalls.length]);

  const displayCalls = activeCalls.length > 0 ? activeCalls : mockCalls;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ringing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'on_hold':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'ended':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleEndCall = (callId: string) => {
    if (onEndCall) {
      onEndCall(callId);
    } else {
      // Mock end call
      setMockCalls(prev => prev.filter(call => call.id !== callId));
      if (selectedCall?.id === callId) {
        setSelectedCall(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Live Call Dashboard</h2>
          <p className="text-sm text-gray-600 mt-1">
            Monitor active medical intake calls in real-time
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">{displayCalls.length} Active Calls</span>
          </div>
        </div>
      </div>

      {displayCalls.length === 0 ? (
        <div className="bg-white rounded-lg shadow border">
          <div className="text-center py-12">
            <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Calls</h3>
            <p className="text-gray-500">Active calls will appear here when patients call your medical intake bot.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Calls List */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Active Calls</h3>
            {displayCalls.map((call) => (
              <div
                key={call.id}
                className={`bg-white p-6 rounded-lg shadow border-2 cursor-pointer transition-all ${
                  selectedCall?.id === call.id 
                    ? 'border-blue-500 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedCall(call)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <PhoneCall className="w-5 h-5 text-green-600" />
                      {call.status === 'active' && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {call.patient_name || `Patient ${call.patient_id || 'Unknown'}`}
                      </h4>
                      <p className="text-sm text-gray-600">{call.phone_number}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(call.status)}`}>
                      {call.status.replace('_', ' ').toUpperCase()}
                    </span>
                    {call.urgency_level && (
                      <span className={`px-2 py-1 text-xs rounded-full border ${getUrgencyColor(call.urgency_level)}`}>
                        {call.urgency_level.toUpperCase()} PRIORITY
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{formatDuration(call.duration)}</span>
                  </div>
                  <div className="flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    <span className="truncate">{call.current_step || 'In progress'}</span>
                  </div>
                </div>

                {/* Quick Info */}
                {call.collected_info && (
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <p className="font-medium text-gray-700 mb-1">Current Information:</p>
                    <div className="space-y-1">
                      {call.collected_info.reason_for_call && (
                        <p><span className="font-medium">Reason:</span> {call.collected_info.reason_for_call}</p>
                      )}
                      {call.collected_info.pain_level && (
                        <p><span className="font-medium">Pain Level:</span> {call.collected_info.pain_level}/10</p>
                      )}
                      {call.collected_info.emergency && (
                        <p className="text-red-600 font-medium">⚠️ EMERGENCY CALL</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCall(call);
                      setShowTranscript(true);
                    }}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    View Transcript
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEndCall(call.id);
                    }}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  >
                    End Call
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Call Details Panel */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Call Details</h3>
            
            {selectedCall ? (
              <div className="bg-white rounded-lg shadow border">
                <div className="p-6">
                  {/* Call Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">
                        {selectedCall.patient_name || `Call ${selectedCall.id}`}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Started {new Date(selectedCall.start_time).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-mono font-bold text-gray-900">
                        {formatDuration(selectedCall.duration)}
                      </div>
                      <p className="text-xs text-gray-500">Duration</p>
                    </div>
                  </div>

                  {/* Patient Information */}
                  <div className="mb-6">
                    <h5 className="font-semibold text-gray-900 mb-3">Patient Information</h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Patient ID:</span>
                        <p>{selectedCall.patient_id || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Phone:</span>
                        <p>{selectedCall.phone_number || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Current Step:</span>
                        <p>{selectedCall.current_step || 'In progress'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Priority:</span>
                        <p className={`inline-block px-2 py-1 text-xs rounded ${getUrgencyColor(selectedCall.urgency_level)}`}>
                          {selectedCall.urgency_level?.toUpperCase() || 'NORMAL'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Collected Information */}
                  {selectedCall.collected_info && (
                    <div className="mb-6">
                      <h5 className="font-semibold text-gray-900 mb-3">Collected Information</h5>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {Object.entries(selectedCall.collected_info).map(([key, value]) => (
                          <div key={key} className="mb-2 last:mb-0">
                            <span className="font-medium text-gray-600 capitalize">
                              {key.replace('_', ' ')}:
                            </span>
                            <span className="ml-2">
                              {Array.isArray(value) ? value.join(', ') : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Function Calls */}
                  {selectedCall.function_calls && selectedCall.function_calls.length > 0 && (
                    <div className="mb-6">
                      <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Zap className="w-4 h-4 mr-2" />
                        Function Calls
                      </h5>
                      <div className="space-y-2">
                        {selectedCall.function_calls.map((func, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-3 ${
                                func.status === 'completed' ? 'bg-green-400' :
                                func.status === 'pending' ? 'bg-yellow-400 animate-pulse' :
                                'bg-red-400'
                              }`}></div>
                              <span className="font-medium">{func.function_name}</span>
                            </div>
                            <div className="text-right">
                              <span className={`text-xs px-2 py-1 rounded ${
                                func.status === 'completed' ? 'bg-green-100 text-green-800' :
                                func.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {func.status}
                              </span>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(func.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Transcript */}
                  {selectedCall.live_transcript && selectedCall.live_transcript.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Recent Conversation
                      </h5>
                      <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                        <div className="space-y-2">
                          {selectedCall.live_transcript.slice(-5).map((line, index) => {
                            const isBot = line.startsWith('Bot:');
                            return (
                              <div
                                key={index}
                                className={`p-2 rounded ${
                                  isBot ? 'bg-blue-100 text-blue-900' : 'bg-white text-gray-900'
                                }`}
                              >
                                <p className="text-sm">{line}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <button
                        onClick={() => setShowTranscript(true)}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        View full transcript →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow border">
                <div className="text-center py-12">
                  <User className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Select a call to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Transcript Modal */}
      {showTranscript && selectedCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Live Transcript - {selectedCall.patient_name || selectedCall.id}
              </h3>
              <button
                onClick={() => setShowTranscript(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {selectedCall.live_transcript ? (
                <div className="space-y-3">
                  {selectedCall.live_transcript.map((line, index) => {
                    const isBot = line.startsWith('Bot:');
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          isBot ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-gray-50 border-l-4 border-gray-400'
                        }`}
                      >
                        <p className="text-sm">{line}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No transcript available</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Emergency Alert */}
      {displayCalls.some(call => call.urgency_level === 'high' || call.collected_info?.emergency) && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <div>
              <p className="font-semibold">Emergency Call Active</p>
              <p className="text-sm">High priority patient needs immediate attention</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MidCallDashboard;