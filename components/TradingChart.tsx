'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';

interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface GraphData {
  data: CandleData[];
  type: string;
  title: string;
  description: string;
}

interface TradingChartProps {
  graphData: GraphData;
}

// Custom candlestick rendering using bars
const CandlestickBar = (props: any) => {
  const { x, y, width, height, payload } = props;
  
  if (!payload || payload.open === undefined) return null;

  const { open, close, high, low } = payload;
  const isGreen = close > open;
  const color = isGreen ? '#10b981' : '#ef4444';
  const bodyColor = isGreen ? '#10b981' : '#ef4444';
  
  // Calculate positions
  const bodyTop = Math.min(open, close);
  const bodyBottom = Math.max(open, close);
  const bodyHeight = Math.abs(close - open);
  
  // Scale factor for positioning
  const priceRange = high - low;
  const scale = height / priceRange;
  
  // Calculate y positions
  const highY = y;
  const lowY = y + height;
  const bodyTopY = y + (high - bodyTop) * scale;
  const bodyBottomY = y + (high - bodyBottom) * scale;
  
  return (
    <g>
      {/* Wick (high-low line) */}
      <line
        x1={x + width / 2}
        y1={highY}
        x2={x + width / 2}
        y2={lowY}
        stroke={color}
        strokeWidth={1}
      />
      {/* Body (open-close rectangle) */}
      <rect
        x={x + width * 0.2}
        y={bodyTopY}
        width={width * 0.6}
        height={Math.max(bodyBottomY - bodyTopY, 1)}
        fill={bodyColor}
        stroke={bodyColor}
        strokeWidth={1}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isGreen = data.close > data.open;
    
    return (
      <Card className="p-3 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
          {new Date(data.time).toLocaleDateString()}
        </p>
        <div className="space-y-1 text-xs">
          <p className="text-slate-700 dark:text-slate-300">
            <span className="font-semibold">Open:</span> ${data.open.toLocaleString()}
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            <span className="font-semibold">High:</span> ${data.high.toLocaleString()}
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            <span className="font-semibold">Low:</span> ${data.low.toLocaleString()}
          </p>
          <p className={`font-semibold ${isGreen ? 'text-green-600' : 'text-red-600'}`}>
            <span className="text-slate-700 dark:text-slate-300 font-semibold">Close:</span> ${data.close.toLocaleString()}
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            <span className="font-semibold">Volume:</span> {data.volume.toFixed(2)}
          </p>
        </div>
      </Card>
    );
  }
  return null;
};

export function TradingChart({ graphData }: TradingChartProps) {
  if (!graphData || !graphData.data || graphData.data.length === 0) {
    return null;
  }

  const { data, title, description, type } = graphData;

  // Format data for the chart
  const chartData = data.map(item => ({
    ...item,
    date: new Date(item.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <Card className="mt-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-blue-600" />
          {title}
        </CardTitle>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-slate-700" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={11}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                yAxisId="price"
                stroke="#6b7280"
                fontSize={11}
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <YAxis 
                yAxisId="volume"
                orientation="right"
                stroke="#6b7280"
                fontSize={11}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
              />
              
              {/* Volume bars */}
              <Bar
                yAxisId="volume"
                dataKey="volume"
                fill="url(#volumeGradient)"
                name="Volume"
                opacity={0.6}
              />
              
              {/* Price line */}
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="close"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
                name="Close Price"
              />
              
              {/* High line */}
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="high"
                stroke="#10b981"
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
                name="High"
              />
              
              {/* Low line */}
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="low"
                stroke="#ef4444"
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
                name="Low"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">Current</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              ${data[data.length - 1].close.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">High</p>
            <p className="text-sm font-semibold text-green-600">
              ${Math.max(...data.map(d => d.high)).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">Low</p>
            <p className="text-sm font-semibold text-red-600">
              ${Math.min(...data.map(d => d.low)).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">Change</p>
            <p className={`text-sm font-semibold ${
              data[data.length - 1].close > data[0].open ? 'text-green-600' : 'text-red-600'
            }`}>
              {((data[data.length - 1].close - data[0].open) / data[0].open * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
