// src/components/botmanager.tsx
'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, User, Phone, Settings, ExternalLink } from 'lucide-react';

interface Bot {
  id: string;
  name: string;
  prompt?: string;
  voice: string;
  language: string;
  status?: string;
  created_at?: string;
  webhooks?: {
    pre_call_url?: string;
    post_call_url?: string;
  };
}

interface BotManagerProps {
  bots: Bot[];
  loading: boolean;
  onCreateBot: (botData: any) => void;
  onUpdateBot: (botId: string, botData: any) => void;
  onDeleteBot: (botId: string) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  selectedBot: Bot | null;
  setSelectedBot: (bot: Bot | null) => void;
}

const BotManager: React.FC<BotManagerProps> = ({ 
  bots, 
  loading, 
  onCreateBot, 
  onUpdateBot, 
  onDeleteBot, 
  showForm, 
  setShowForm,
  selectedBot,
  setSelectedBot
}) => {
  const [formData, setFormData] = useState({
    name: '',
    prompt: '',
    voice: 'alloy',
    language: 'en'
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Bot name is required';
    }
    
    if (formData.name.length > 100) {
      newErrors.name = 'Bot name must be less than 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const botData = {
      ...formData,
      prompt: formData.prompt.trim() || undefined // Use default if empty
    };

    if (selectedBot) {
      onUpdateBot(selectedBot.id, botData);
    } else {
      onCreateBot(botData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', prompt: '', voice: 'alloy', language: 'en' });
    setErrors({});
    setShowForm(false);
    setSelectedBot(null);
  };

  const handleEdit = (bot: Bot) => {
    setSelectedBot(bot);
    setFormData({
      name: bot.name || '',
      prompt: bot.prompt || '',
      voice: bot.voice || 'alloy',
      language: bot.language || 'en'
    });
    setShowForm(true);
  };

  const handleCreateNew = () => {
    setShowForm(true);
    setSelectedBot(null);
    setFormData({ name: '', prompt: '', voice: 'alloy', language: 'en' });
    setErrors({});
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading bots...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Medical Intake Bots</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your AI-powered medical intake assistants
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Bot
        </button>
      </div>

      {/* Bot Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {selectedBot ? 'Edit Bot' : 'Create New Bot'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bot Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full rounded-md shadow-sm p-3 border transition-colors ${
                    errors.name 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="e.g., Medical Intake Assistant"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voice
                </label>
                <select
                  value={formData.voice}
                  onChange={(e) => setFormData({ ...formData, voice: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="alloy">Alloy (Neutral)</option>
                  <option value="echo">Echo (Male)</option>
                  <option value="fable">Fable (British)</option>
                  <option value="onyx">Onyx (Deep)</option>
                  <option value="nova">Nova (Female)</option>
                  <option value="shimmer">Shimmer (Soft)</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Prompt (Optional)
              </label>
              <textarea
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                className="w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-blue-500 focus:border-blue-500"
                rows={6}
                placeholder="Leave empty to use the default medical intake prompt. Customize here if needed..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Default prompt includes patient identification, medical history gathering, and appointment scheduling.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                {selectedBot ? 'Update Bot' : 'Create Bot'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bots List */}
      <div className="bg-white rounded-lg shadow border">
        {bots.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bots created yet</h3>
            <p className="text-gray-500 mb-6">Create your first medical intake bot to get started</p>
            <button
              onClick={handleCreateNew}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Bot
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {bots.map((bot) => (
              <div key={bot.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-medium text-gray-900 mr-3">{bot.name}</h3>
                      {bot.status && (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          bot.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {bot.status}
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Bot ID:</span> 
                        <code className="ml-1 bg-gray-100 px-2 py-1 rounded text-xs">{bot.id}</code>
                      </div>
                      <div>
                        <span className="font-medium">Voice:</span> {bot.voice}
                      </div>
                      <div>
                        <span className="font-medium">Language:</span> {bot.language}
                      </div>
                    </div>

                    {bot.created_at && (
                      <p className="text-xs text-gray-500 mt-2">
                        Created: {new Date(bot.created_at).toLocaleString()}
                      </p>
                    )}

                    {/* Webhook Status */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {bot.webhooks?.pre_call_url && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full">
                          Pre-call webhook active
                        </span>
                      )}
                      {bot.webhooks?.post_call_url && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full">
                          Post-call webhook active
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => window.open('https://chat.openmic.ai', '_blank')}
                      className="text-green-600 hover:text-green-800 p-2 rounded-md hover:bg-green-50 transition-colors"
                      title="Test on OpenMic Dashboard"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(bot)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-50 transition-colors"
                      title="Edit Bot"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteBot(bot.id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-md hover:bg-red-50 transition-colors"
                      title="Delete Bot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <Settings className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-800">Testing Your Bot</h3>
            <p className="text-sm text-blue-700 mt-1">
              After creating a bot, use the OpenMic Dashboard to test it with the "Test Call" feature. 
              Make sure your ngrok tunnel is running for webhooks to work properly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotManager;