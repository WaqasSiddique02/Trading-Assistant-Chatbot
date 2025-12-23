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
    <Card className="mt-3 bg-white border-gray-200 w-full shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-600" />
          <span className="text-gray-900">Market Data</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {marketData.BTCUSDT && (
            <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
              <div className="flex items-center justify-between mb-1">
                <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                  {marketData.BTCUSDT.symbol}
                </Badge>
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-orange-900">
                ${parseFloat(marketData.BTCUSDT.price).toLocaleString()}
              </p>
              <p className="text-xs text-orange-600 mt-1">
                {new Date(marketData.BTCUSDT.timestamp).toLocaleTimeString()}
              </p>
            </div>
          )}
          {marketData.ETHUSDT && (
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center justify-between mb-1">
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                  {marketData.ETHUSDT.symbol}
                </Badge>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-blue-900">
                ${parseFloat(marketData.ETHUSDT.price).toLocaleString()}
              </p>
              <p className="text-xs text-blue-600 mt-1">
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
                    borderRadius: '8px',
                    color: '#0f172a'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ fill: '#2563eb', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
