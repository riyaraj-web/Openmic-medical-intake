// src/components/calllogs.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Clock, User, FileText, AlertCircle, CheckCircle, Calendar, Filter, Search, Download } from 'lucide-react';

interface Call {
  id: string;
  bot_id: string;
  patient_id?: string;
  timestamp: string;
  duration: number;
  outcome: string;
  summary: string;
  transcript?: string;
  phone_number?: string;
  function_calls?: Array<{
    function_name: string;
    parameters: any;
    response: any;
  }>;
  metadata?: {
    call_type?: string;
    urgency_level?: string;
    appointment_scheduled?: boolean;
  };
}

interface CallLogsProps {
  calls: Call[];
}

const CallLogs: React.FC<CallLogsProps> = ({ calls }) => {
  const [filteredCalls, setFilteredCalls] = useState<Call[]>(calls);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOutcome, setFilterOutcome] = useState('all');
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);

  // Update filtered calls when calls prop changes
  useEffect(() => {
    setFilteredCalls(calls);
  }, [calls]);

  // Filter calls based on search and outcome filter
  useEffect(() => {
    let filtered = calls;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(call => 
        call.patient_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.phone_number?.includes(searchTerm)
      );
    }

    // Outcome filter
    if (filterOutcome !== 'all') {
      filtered = filtered.filter(call => call.outcome === filterOutcome);
    }

    setFilteredCalls(filtered);
  }, [calls, searchTerm, filterOutcome]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'appointment_scheduled':
        return 'bg-green-100 text-green-800';
      case 'follow_up_required':
        return 'bg-yellow-100 text-yellow-800';
      case 'emergency_referred':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'incomplete':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'appointment_scheduled':
        return <CheckCircle className="w-4 h-4" />;
      case 'follow_up_required':
        return <Clock className="w-4 h-4" />;
      case 'emergency_referred':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Phone className="w-4 h-4" />;
    }
  };

  const exportCallData = () => {
    const dataStr = JSON.stringify(filteredCalls, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `call-logs-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const uniqueOutcomes = [...new Set(calls.map(call => call.outcome))];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Call Logs</h2>
          <p className="text-sm text-gray-600 mt-1">
            Track and analyze your medical intake calls
          </p>
        </div>
        <button
          onClick={exportCallData}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center transition-colors"
          disabled={filteredCalls.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by patient ID, summary, or phone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Outcome Filter */}
          <div className="sm:w-48">
            <select
              value={filterOutcome}
              onChange={(e) => setFilterOutcome(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Outcomes</option>
              {uniqueOutcomes.map(outcome => (
                <option key={outcome} value={outcome}>
                  {outcome.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-2xl font-bold text-gray-900">{filteredCalls.length}</p>
            <p className="text-xs text-gray-600">Total Calls</p>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <p className="text-2xl font-bold text-green-600">
              {filteredCalls.filter(call => call.outcome === 'appointment_scheduled').length}
            </p>
            <p className="text-xs text-gray-600">Appointments</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded">
            <p className="text-2xl font-bold text-yellow-600">
              {filteredCalls.filter(call => call.outcome === 'follow_up_required').length}
            </p>
            <p className="text-xs text-gray-600">Follow-ups</p>
          </div>
          <div className="bg-blue-50 p-3 rounded">
            <p className="text-2xl font-bold text-blue-600">
              {filteredCalls.length > 0 ? Math.round(filteredCalls.reduce((acc, call) => acc + call.duration, 0) / filteredCalls.length) : 0}s
            </p>
            <p className="text-xs text-gray-600">Avg Duration</p>
          </div>
        </div>
      </div>

      {/* Call List */}
      <div className="bg-white rounded-lg shadow border">
        {filteredCalls.length === 0 ? (
          <div className="text-center py-12">
            <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {calls.length === 0 ? 'No calls recorded yet' : 'No calls match your filters'}
            </h3>
            <p className="text-gray-500">
              {calls.length === 0 
                ? 'Call logs will appear here once your bot starts receiving calls.' 
                : 'Try adjusting your search terms or filters.'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredCalls.map((call) => (
              <div key={call.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center mr-4">
                        {getOutcomeIcon(call.outcome)}
                        <h3 className="text-lg font-medium text-gray-900 ml-2">
                          Call {call.id}
                        </h3>
                      </div>
                      <span className={`px-3 py-1 text-xs rounded-full flex items-center ${getOutcomeColor(call.outcome)}`}>
                        {call.outcome.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Patient: {call.patient_id || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Duration: {formatDuration(call.duration)}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{new Date(call.timestamp).toLocaleString()}</span>
                      </div>
                      {call.phone_number && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{call.phone_number}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{call.summary}</p>

                    {/* Function Calls */}
                    {call.function_calls && call.function_calls.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-gray-600 mb-2">Function Calls:</h4>
                        <div className="flex flex-wrap gap-2">
                          {call.function_calls.map((func, index) => (
                            <span
                              key={index}
                              className="bg-blue-50 text-blue-700 px-2 py-1 text-xs rounded border"
                            >
                              {func.function_name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Metadata */}
                    {call.metadata && (
                      <div className="flex flex-wrap gap-2">
                        {call.metadata.call_type && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded">
                            Type: {call.metadata.call_type}
                          </span>
                        )}
                        {call.metadata.urgency_level && (
                          <span className={`px-2 py-1 text-xs rounded ${
                            call.metadata.urgency_level === 'high' 
                              ? 'bg-red-100 text-red-700' 
                              : call.metadata.urgency_level === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {call.metadata.urgency_level} priority
                          </span>
                        )}
                        {call.metadata.appointment_scheduled && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded">
                            Appointment Scheduled
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    <button
                      onClick={() => {
                        setSelectedCall(call);
                        setShowTranscript(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-50 transition-colors"
                      title="View Details"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call Details Modal */}
      {showTranscript && selectedCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Call Details - {selectedCall.id}</h3>
                <button
                  onClick={() => setShowTranscript(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold mb-2">Call Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Patient ID:</span> {selectedCall.patient_id || 'N/A'}</p>
                    <p><span className="font-medium">Duration:</span> {formatDuration(selectedCall.duration)}</p>
                    <p><span className="font-medium">Outcome:</span> {selectedCall.outcome}</p>
                    <p><span className="font-medium">Timestamp:</span> {new Date(selectedCall.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Summary</h4>
                  <p className="text-sm text-gray-700">{selectedCall.summary}</p>
                </div>
              </div>

              {selectedCall.function_calls && selectedCall.function_calls.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Function Calls</h4>
                  <div className="space-y-2">
                    {selectedCall.function_calls.map((func, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded text-sm">
                        <p className="font-medium">{func.function_name}</p>
                        <p className="text-gray-600 mt-1">
                          Parameters: {JSON.stringify(func.parameters, null, 2)}
                        </p>
                        {func.response && (
                          <p className="text-gray-600 mt-1">
                            Response: {JSON.stringify(func.response, null, 2)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedCall.transcript && (
                <div>
                  <h4 className="font-semibold mb-2">Transcript</h4>
                  <div className="bg-gray-50 p-4 rounded text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {selectedCall.transcript}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallLogs;