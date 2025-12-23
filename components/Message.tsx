'use client';

import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Bot, User, Clock, Info } from 'lucide-react';
import { MarketChart } from './MarketChart';
import { TradingChart } from './TradingChart';
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
  graphData?: {
    data: any[];
    type: 'area' | 'line' | 'candle' | 'bar' | 'gauge';
    title: string;
    description: string;
  };
}

export function Message({ role, content, timestamp, context, marketData, graphData }: MessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-2 sm:gap-3 w-full ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar className={`h-7 w-7 sm:h-8 sm:w-8 shrink-0 ${isUser ? 'bg-blue-600' : 'bg-gray-700'}`}>
        <AvatarFallback className="text-white">
          {isUser ? <User className="h-3 w-3 sm:h-4 sm:w-4" /> : <Bot className="h-3 w-3 sm:h-4 sm:w-4" />}
        </AvatarFallback>
      </Avatar>

      <div className={`flex flex-col gap-2 min-w-0 flex-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <Card
          className={`p-3 sm:p-4 max-w-full wrap-break-word ${
            isUser
              ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
              : 'bg-white border-gray-200 text-gray-900 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant={isUser ? 'secondary' : 'outline'} className={`text-xs ${isUser ? 'bg-white/20 text-white border-white/30' : 'bg-gray-100 text-gray-700 border-gray-300'}`}>
              {isUser ? 'You' : 'Bot'}
            </Badge>
            <span className={`text-xs flex items-center gap-1 ${isUser ? 'text-white/70' : 'text-gray-500'}`}>
              <Clock className="h-3 w-3" />
              {format(new Date(timestamp), 'HH:mm:ss')}
            </span>
          </div>
          
          <p className={`text-sm leading-relaxed whitespace-pre-wrap wrap-break-word ${isUser ? 'text-white' : 'text-gray-800'}`}>
            {content}
          </p>
        </Card>

        {!isUser && graphData && (
          <>
            {console.log('Message component - graphData:', graphData)}
            <div className="w-full max-w-full overflow-hidden">
              <TradingChart graphData={graphData} />
            </div>
          </>
        )}

        {!isUser && !graphData && marketData && (
          <div className="w-full max-w-full overflow-hidden">
            <MarketChart marketData={marketData} />
          </div>
        )}

        {!isUser && context && context.length > 0 && (
          <Card className="p-3 bg-gray-50 border-gray-200 w-full max-w-full shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-blue-600 shrink-0" />
              <span className="text-xs font-semibold text-gray-700">
                Sources
              </span>
            </div>
            <Separator className="mb-2 bg-gray-200" />
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {context.slice(0, 5).map((ctx, idx) => (
                <p key={idx} className="text-xs text-gray-600 leading-relaxed wrap-break-word">
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
