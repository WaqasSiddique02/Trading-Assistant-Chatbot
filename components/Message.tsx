'use client';

import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Bot, User, Clock, Info } from 'lucide-react';
import { MarketChart } from './MarketChart';
import { format } from 'date-fns';
import { Separator } from './ui/separator';

interface MessageProps {
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
}

export function Message({ role, content, timestamp, context, marketData }: MessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse justify-start' : 'flex-row'}`}>
      <Avatar className={`h-8 w-8 ${isUser ? 'bg-purple-600' : 'bg-blue-600'}`}>
        <AvatarFallback className="text-white">
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div className={`space-y-2 ${isUser ? 'max-w-[70%]' : 'flex-1 max-w-[85%]'} ${isUser ? 'items-end' : 'items-start'}`}>
        <Card
          className={`p-4 ${isUser ? 'inline-block' : ''} ${
            isUser
              ? 'bg-purple-600 text-white border-purple-500'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={isUser ? 'secondary' : 'outline'} className={`text-xs ${isUser ? 'bg-white/20 text-white border-white/30' : ''}`}>
              {isUser ? 'You' : 'Trading Bot'}
            </Badge>
            <span className={`text-xs flex items-center gap-1 ${isUser ? 'text-white/80' : 'text-slate-500'}`}>
              <Clock className="h-3 w-3" />
              {format(new Date(timestamp), 'HH:mm:ss')}
            </span>
          </div>
          
          <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isUser ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>
            {content}
          </p>
        </Card>

        {!isUser && marketData && (
          <MarketChart marketData={marketData} />
        )}

        {!isUser && context && context.length > 0 && (
          <Card className="p-3 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Context & Sources
              </span>
            </div>
            <Separator className="mb-2" />
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {context.slice(0, 5).map((ctx, idx) => (
                <p key={idx} className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  • {ctx}
                </p>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
