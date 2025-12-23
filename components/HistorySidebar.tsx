'use client';

import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { Trash2, MessageSquare } from 'lucide-react';

interface MessageType {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface HistorySidebarProps {
  messages: MessageType[];
  onClearHistory: () => void;
}

export function HistorySidebar({ messages, onClearHistory }: HistorySidebarProps) {
  // Group messages by date
  const groupedMessages = messages.reduce((acc, msg) => {
    const date = new Date(msg.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(msg);
    return acc;
  }, {} as Record<string, MessageType[]>);

  return (
    <div className="w-64 border-r bg-white border-gray-200 flex flex-col h-screen hidden lg:flex">
      <div className="p-4 border-b border-gray-200 shrink-0">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Chat History
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearHistory}
          className="w-full gap-2 bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 border-gray-300 hover:border-red-300"
        >
          <Trash2 className="h-4 w-4" />
          Clear History
        </Button>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-4">
          {Object.keys(groupedMessages).length === 0 ? (
            <div className="text-center py-8 px-3">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-500">
                No chat history yet
              </p>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date}>
                <p className="text-xs font-medium text-gray-500 mb-2 px-2">
                  {date}
                </p>
                <div className="space-y-1">
                  {msgs.filter(m => m.role === 'user').map((msg, idx) => (
                    <Card
                      key={idx}
                      className="p-2 bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer"
                    >
                      <p className="text-xs text-gray-700 line-clamp-2">
                        {msg.content}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
