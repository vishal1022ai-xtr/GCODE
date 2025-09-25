import React, { useState, useRef, useEffect } from 'react';
// Fix: Correct import path for types.
import type { ChatMessage, Prescription } from '../types';
// Fix: Correct import path for geminiService.
import { getAIResponse } from '../services/geminiService';
import { Chat } from '@google/genai';
import { MicrophoneIcon, GlobeIcon } from './Icons';

const AIChat: React.FC<{ prescription: Prescription }> = ({ prescription }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', parts: [{ text: "Hello! I'm MediMinder AI. How can I help you with your medications today?" }] }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const { chat, response } = await getAIResponse(
        chatRef.current,
        messages,
        input,
        prescription
      );
      chatRef.current = chat;
      const modelMessage: ChatMessage = { role: 'model', parts: [{ text: response }] };
      setMessages(prev => [...prev, modelMessage]);
    } catch (e) {
      setError("Sorry, I couldn't get a response. Please try again.");
      console.error(e);
      // Restore user message to allow retry
      setMessages(prev => prev.slice(0, -1));
      setInput(userMessage.parts[0].text);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-full flex flex-col max-h-[80vh]">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-lg">AI Assistant</h3>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg max-w-xs lg:max-w-md ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                {msg.parts[0].text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700">
                  <span className="animate-pulse">...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
       {error && <div className="p-4 text-red-500 text-sm">{error}</div>}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
           <button title="Toggle Language (ENG/HI)" className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
                <GlobeIcon className="w-6 h-6" />
           </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your medicine..."
            className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button title="Use Voice" className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50" disabled>
             <MicrophoneIcon className="w-6 h-6" />
          </button>
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-blue-300 dark:disabled:bg-blue-800"
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;