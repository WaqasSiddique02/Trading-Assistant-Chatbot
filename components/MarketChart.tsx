'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketData {
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
}

interface MarketChartProps {
  marketData: MarketData;
}

export function MarketChart({ marketData }: MarketChartProps) {
  if (!marketData || (!marketData.BTCUSDT && !marketData.ETHUSDT)) {
    return null;
  }

  const chartData = [
    {
      name: 'BTC',
      price: marketData.BTCUSDT ? parseFloat(marketData.BTCUSDT.price) : 0,
    },
    {
      name: 'ETH',
      price: marketData.ETHUSDT ? parseFloat(marketData.ETHUSDT.price) : 0,
    },
  ].filter(item => item.price > 0);

  return (
    <Card className="mt-3 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-600" />
          Market Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {marketData.BTCUSDT && (
            <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between mb-1">
                <Badge variant="outline" className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 border-orange-300 dark:border-orange-700">
                  {marketData.BTCUSDT.symbol}
                </Badge>
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                ${parseFloat(marketData.BTCUSDT.price).toLocaleString()}
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                {new Date(marketData.BTCUSDT.timestamp).toLocaleTimeString()}
              </p>
            </div>
          )}
          {marketData.ETHUSDT && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-1">
                <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700">
                  {marketData.ETHUSDT.symbol}
                </Badge>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                ${parseFloat(marketData.ETHUSDT.price).toLocaleString()}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {new Date(marketData.ETHUSDT.timestamp).toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>
        
        {chartData.length > 0 && (
          <div className="h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
