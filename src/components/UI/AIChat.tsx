import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader } from 'lucide-react';
import { ChatMessage } from '../../types';
import { patientService, aiService } from '../../services/api';
import { useNotification } from '../../hooks/useNotification';

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: "Hello! I'm your AI healthcare assistant. I can help you register patients or book appointments using natural language. Just tell me what you'd like to do!",
      isBot: true,
      timestamp: new Date(),
      type: 'general'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const { showNotification } = useNotification(); // Removed unused

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processAIResponse = async (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Detect intent
    if (lowerMessage.includes('register') || lowerMessage.includes('new patient') || lowerMessage.includes('add patient')) {
      return await handlePatientRegistration(userMessage);
    } else if (lowerMessage.includes('appointment') || lowerMessage.includes('book') || lowerMessage.includes('schedule')) {
      return await handleAppointmentBooking(userMessage);
    } else {
      return "I can help you with:\n• Registering new patients\n• Booking appointments\n\nPlease tell me what you'd like to do. For example:\n- 'Register a new patient named John Doe'\n- 'Book an appointment for patient ID 123'";
    }
  };

  const handlePatientRegistration = async (message: string) => {
    try {
      const response = await patientService.createPatientAI(message);
      if (response.status) {
        return `✅ Patient registered successfully! Patient ID: ${response.id}\n\nThe patient has been added to the system and can now book appointments.`;
      } else {
        return "❌ I couldn't register the patient. Please provide more details like:\n• Full name\n• Gender\n• Any known allergies\n\nExample: 'Register John Doe, male, allergic to penicillin'";
      }
    } catch (error) {
      return "❌ There was an error registering the patient. Please try again or use the manual registration form.";
    }
  };

  const handleAppointmentBooking = async (message: string) => {
    try {
      // Extract patient ID if mentioned
      const patientIdMatch = message.match(/patient\s+(?:id\s+)?(\d+)/i);
      if (patientIdMatch) {
        const patientId = parseInt(patientIdMatch[1]);
        const response = await aiService.createEMR(message, patientId);
        
        if (response.status) {
          return `✅ Appointment request processed! \n\nI've created an ${response.resource} for patient ID ${patientId}. Please check the appointments section for details.`;
        }
      }
      
      return "To book an appointment, I need:\n• Patient ID or patient name\n• Preferred date and time\n• Reason for visit\n\nExample: 'Book appointment for patient ID 123 tomorrow at 2 PM for checkup'";
    } catch (error) {
      return "❌ There was an error processing the appointment. Please try again or use the manual booking form.";
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await processAIResponse(inputMessage);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: aiResponse,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: "I'm sorry, I encountered an error. Please try again or contact support.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px] card">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-200">
        <div className="bg-gradient-to-r from-primary-500 to-health-600 p-2 rounded-lg mr-3">
          <Bot className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">AI Healthcare Assistant</h3>
          <p className="text-sm text-gray-600">Register patients & book appointments with natural language</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`flex max-w-[80%] ${message.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`flex-shrink-0 ${message.isBot ? 'mr-3' : 'ml-3'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.isBot 
                    ? 'bg-gradient-to-r from-primary-500 to-health-600' 
                    : 'bg-gray-600'
                }`}>
                  {message.isBot ? (
                    <Bot className="h-4 w-4 text-white" />
                  ) : (
                    <User className="h-4 w-4 text-white" />
                  )}
                </div>
              </div>
              <div className={`px-4 py-3 rounded-2xl ${
                message.isBot
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-gradient-to-r from-primary-500 to-health-600 text-white'
              }`}>
                <p className="text-sm whitespace-pre-line">{message.message}</p>
                <p className={`text-xs mt-1 ${
                  message.isBot ? 'text-gray-500' : 'text-white/70'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-health-600 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <Loader className="h-4 w-4 animate-spin text-gray-600" />
                  <span className="text-sm text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-3">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (e.g., 'Register John Doe, male, allergic to penicillin')"
            className="flex-1 resize-none input-field"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="btn-primary px-4 self-end"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          Try: "Register Sarah Johnson, female, no allergies" or "Book appointment for patient 123 tomorrow at 2 PM"
        </div>
      </div>
    </div>
  );
};

export default AIChat;