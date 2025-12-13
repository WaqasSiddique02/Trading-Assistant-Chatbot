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
    type: string;
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

      if (data.success) {
        const assistantMessage: MessageType = {
          role: 'assistant',
          content: data.response.answer,
          timestamp: new Date(),
          context: data.response.context,
          marketData: data.response.market_data,
          graphData: data.response.graph_data,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
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
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* History Sidebar */}
      <HistorySidebar messages={messages} onClearHistory={handleClearHistory} />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="border-b bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Trading Bot Assistant
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  AI-powered crypto trading insights
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="px-6 py-6">
              {messages.length === 0 ? (
                <Card className="p-8 text-center bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <Bot className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                  <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Welcome to Trading Bot Assistant
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Ask me anything about cryptocurrency markets, trading strategies, or get real-time market insights!
                  </p>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                    <Card className="p-3 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-900 dark:text-blue-100">
                        💡 "What's the current price of BTC?"
                      </p>
                    </Card>
                    <Card className="p-3 bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
                      <p className="text-sm text-purple-900 dark:text-purple-100">
                        📈 "Should I buy or sell ETH?"
                      </p>
                    </Card>
                    <Card className="p-3 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-900 dark:text-green-100">
                        📊 "Show me market trends"
                      </p>
                    </Card>
                    <Card className="p-3 bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800">
                      <p className="text-sm text-orange-900 dark:text-orange-100">
                        📰 "Latest crypto news?"
                      </p>
                    </Card>
                  </div>
                </Card>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, idx) => (
                    <Message key={idx} {...msg} />
                  ))}
                  {isLoading && <LoadingMessage />}
                  <div ref={scrollRef} />
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Input */}
        <div className="border-t bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div className="px-6 py-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isRecording ? "Listening..." : "Ask about crypto markets, trading strategies..."}
                disabled={isLoading || isRecording}
                className="flex-1 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              />
              <Button
                onClick={toggleVoiceInput}
                disabled={isLoading}
                className={`${
                  isRecording 
                    ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                    : 'bg-slate-600 hover:bg-slate-700'
                } text-white`}
                title={isRecording ? "Stop recording" : "Start voice input"}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
              {isRecording 
                ? '🎤 Recording... Speak now'
                : 'Press Enter to send • Click mic for voice input'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
