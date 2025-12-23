'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Message } from './Message';
import { LoadingMessage } from './LoadingMessage';
import { HistorySidebar } from './HistorySidebar';
import { Send, Bot, Mic, MicOff } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface MessageType {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: string[];
  marketData?: {
    BTCUSDT?: {
      price: string;
      symbol: string;
      timestamp: string;
    };
    ETHUSDT?: {
      price: string;
      symbol: string;
      timestamp: string;
    };
  };
  graphData?: {
    data: any[];
    type: "area" | "line" | "candle" | "bar" | "gauge";
    title: string;
    description: string;
  };
}

export function ChatInterface() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Get or create session ID
    let sid = localStorage.getItem('chatSessionId');
    if (!sid) {
      sid = uuidv4();
      localStorage.setItem('chatSessionId', sid);
    }
    setSessionId(sid);

    // Load chat history
    loadHistory(sid);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    // Check backend health
    const checkBackendHealth = async () => {
      try {
        const response = await fetch('/api/health');
        if (response.ok) {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      } catch (error) {
        setBackendStatus('offline');
      }
    };

    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 30000); // Check every 30s
    
    return () => clearInterval(interval);
  }, []);

  const loadHistory = async (sid: string) => {
    try {
      const response = await fetch(`/api/history?sessionId=${sid}`);
      const data = await response.json();
      if (data.success && data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: MessageType = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          sessionId,
        }),
      });

      const data = await response.json();
      console.log('API Response:', data);

      // More explicit error checking
      if (!data.success || !data.response) {
        const errorDetails = data.details || data.error || 'Failed to get response';
        const isTimeout = data.timeout || false;
        
        throw new Error(
          isTimeout 
            ? `⏱️ ${errorDetails}` 
            : `❌ ${errorDetails}`
        );
      }

      // Success case
      const assistantMessage: MessageType = {
        role: 'assistant',
        content: data.response.answer,
        timestamp: new Date(),
        context: data.response.context || [],
        marketData: data.response.market_data || undefined,
        graphData: data.response.graph_data || undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Frontend error details:', error);
      
      let errorContent = 'Sorry, I encountered an error. ';
      
      if (error instanceof Error) {
        errorContent += error.message + '. ';
      }
      
      errorContent += '\n\n🔍 Troubleshooting:\n' +
        '1. Make sure your backend server is running at http://localhost:5000\n' +
        '2. Check the browser console (F12) for detailed error logs\n' +
        '3. Verify your backend accepts POST requests to /query with { "query": "message" }\n' +
        '4. Check the terminal running the Next.js app for backend error details';
      
      const errorMessage: MessageType = {
        role: 'assistant',
        content: errorContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm('Are you sure you want to clear all chat history?')) return;

    try {
      await fetch(`/api/history?sessionId=${sessionId}`, {
        method: 'DELETE',
      });
      setMessages([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const initializeSpeechRecognition = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsRecording(false);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      initializeSpeechRecognition();
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* History Sidebar */}
      <HistorySidebar messages={messages} onClearHistory={handleClearHistory} />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="border-b bg-white border-gray-200 shrink-0">
          <div className="px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-xl font-bold text-gray-900 flex items-center gap-2 truncate">
                  Trading Bot
                  <span className={`h-2 w-2 rounded-full shrink-0 ${
                    backendStatus === 'online' ? 'bg-green-500' : 
                    backendStatus === 'offline' ? 'bg-red-500' : 
                    'bg-yellow-500 animate-pulse'
                  }`} />
                </h1>
                <p className="text-xs text-gray-600 truncate">
                  {backendStatus === 'online' ? 'Connected' : 
                   backendStatus === 'offline' ? 'Disconnected' : 
                   'Connecting...'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6">
            {messages.length === 0 ? (
              <div className="max-w-4xl mx-auto">
                <Card className="p-6 sm:p-8 text-center bg-white border-gray-200 shadow-sm">
                  <Bot className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-blue-600" />
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    Trading Bot Assistant
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-6">
                    Ask me about cryptocurrency markets, trading strategies, or real-time insights
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-left">
                    <Card className="p-3 bg-blue-50 border-blue-100 hover:border-blue-300 transition-colors">
                      <p className="text-xs sm:text-sm text-gray-700">
                        💡 "What's the current BTC price?"
                      </p>
                    </Card>
                    <Card className="p-3 bg-blue-50 border-blue-100 hover:border-blue-300 transition-colors">
                      <p className="text-xs sm:text-sm text-gray-700">
                        📈 "Show me trading volume"
                      </p>
                    </Card>
                    <Card className="p-3 bg-blue-50 border-blue-100 hover:border-blue-300 transition-colors">
                      <p className="text-xs sm:text-sm text-gray-700">
                        📊 "Market trends analysis"
                      </p>
                    </Card>
                    <Card className="p-3 bg-blue-50 border-blue-100 hover:border-blue-300 transition-colors">
                      <p className="text-xs sm:text-sm text-gray-700">
                        💰 "Best trading strategies"
                      </p>
                    </Card>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
                {messages.map((msg, idx) => (
                  <Message key={idx} {...msg} />
                ))}
                {isLoading && <LoadingMessage />}
                <div ref={scrollRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="border-t bg-white border-gray-200 shrink-0">
          <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isRecording ? "Listening..." : "Ask about crypto markets..."}
                  disabled={isLoading || isRecording}
                  className="flex-1 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                />
                <Button
                  onClick={toggleVoiceInput}
                  disabled={isLoading}
                  className={`shrink-0 ${
                    isRecording 
                      ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  } border-0`}
                  title={isRecording ? "Stop recording" : "Start voice input"}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center hidden sm:block">
                {isRecording 
                  ? '🎤 Recording... Speak now'
                  : 'Press Enter to send'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
