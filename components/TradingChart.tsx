'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  ComposedChart,
  BarChart,
  LineChart,
  AreaChart,
  Bar, 
  Line,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { BarChart3 } from 'lucide-react';

interface GraphData {
  data: any[];
  type: 'candle' | 'bar' | 'line' | 'gauge' | 'area';
  title: string;
  description: string;
  stats?: any;
}

interface TradingChartProps {
  graphData: GraphData;
}

// Bar Chart Component
function BarChartComponent({ data }: any) {
  console.log('BarChartComponent received data:', data);
  console.log('First data item:', data[0]);
  
  // Try to detect the correct field names
  const sampleItem = data[0] || {};
  const labelKey = sampleItem.label !== undefined ? 'label' : 
                   sampleItem.time !== undefined ? 'time' :
                   sampleItem.hour !== undefined ? 'hour' :
                   sampleItem.date !== undefined ? 'date' : 'label';
  
  const valueKey = sampleItem.value !== undefined ? 'value' :
                   sampleItem.volume !== undefined ? 'volume' :
                   sampleItem.count !== undefined ? 'count' :
                   sampleItem.price !== undefined ? 'price' : 'value';
  
  console.log('Using labelKey:', labelKey, 'valueKey:', valueKey);
  
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey={labelKey} stroke="#6b7280" fontSize={11} angle={-45} textAnchor="end" height={80} />
          <YAxis stroke="#6b7280" fontSize={11} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              color: '#0f172a'
            }} 
          />
          <Bar dataKey={valueKey} fill="#2563eb" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Line Chart Component
function LineChartComponent({ data }: any) {
  console.log('LineChartComponent received data:', data);
  console.log('First data item:', data[0]);
  
  // Try to detect the correct field names
  const sampleItem = data[0] || {};
  const labelKey = sampleItem.label !== undefined ? 'label' : 
                   sampleItem.time !== undefined ? 'time' :
                   sampleItem.date !== undefined ? 'date' :
                   sampleItem.timestamp !== undefined ? 'timestamp' :
                   sampleItem.hour !== undefined ? 'hour' :
                   sampleItem.index !== undefined ? 'index' : 'label';
  
  const valueKey = sampleItem.value !== undefined ? 'value' :
                   sampleItem.equity !== undefined ? 'equity' :
                   sampleItem.balance !== undefined ? 'balance' :
                   sampleItem.price !== undefined ? 'price' :
                   sampleItem.amount !== undefined ? 'amount' : 'value';
  
  console.log('Using labelKey:', labelKey, 'valueKey:', valueKey);
  
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey={labelKey} stroke="#6b7280" fontSize={11} angle={-45} textAnchor="end" height={80} />
          <YAxis stroke="#6b7280" fontSize={11} />
          <Tooltip
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              color: '#0f172a'
            }}
          />
          <Line 
            type="monotone" 
            dataKey={valueKey} 
            stroke="#2563eb" 
            strokeWidth={2}
            dot={{ fill: '#2563eb', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Gauge Chart Component
function GaugeChartComponent({ data }: any) {
  const value = data[0]?.value || 0;
  const formatted = data[0]?.formatted || `$${value}`;
  
  return (
    <div className="h-80 w-full flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl font-bold text-blue-600">{formatted}</p>
        <p className="text-lg text-gray-700 mt-4">{data[0]?.label}</p>
        {data[0]?.timestamp && (
          <p className="text-sm text-gray-500 mt-2">
            {new Date(data[0].timestamp).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}

// Area Chart Component
function AreaChartComponent({ data }: any) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="time" stroke="#6b7280" fontSize={11} />
          <YAxis stroke="#6b7280" fontSize={11} />
          <Tooltip
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#8b5cf6" 
            fill="url(#areaGradient)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Candlestick Chart Component
function CandlestickChartComponent({ data }: any) {
  const chartData = data.map((item: any) => ({
    ...item,
    date: new Date(item.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

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
              <span className="font-semibold">Volume:</span> {data.volume?.toFixed(2) || 'N/A'}
            </p>
          </div>
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="h-100 w-full">
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
          {chartData[0]?.volume !== undefined && (
            <Bar
              yAxisId="volume"
              dataKey="volume"
              fill="url(#volumeGradient)"
              name="Volume"
              opacity={0.6}
            />
          )}
          
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
            ${Math.max(...data.map((d: any) => d.high)).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-600 dark:text-slate-400">Low</p>
          <p className="text-sm font-semibold text-red-600">
            ${Math.min(...data.map((d: any) => d.low)).toLocaleString()}
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
    </div>
  );
}

export function TradingChart({ graphData }: TradingChartProps) {
  console.log('TradingChart received graphData:', graphData);
  
  if (!graphData || !graphData.data || graphData.data.length === 0) {
    console.log('TradingChart: No data to display');
    return null;
  }

  const { data, title, description, type } = graphData;
  console.log('TradingChart data length:', data.length, 'type:', type);

  // Render different chart types based on 'type'
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <BarChartComponent data={data} />;
      
      case 'line':
        return <LineChartComponent data={data} />;
      
      case 'gauge':
        return <GaugeChartComponent data={data} />;
      
      case 'area':
        return <AreaChartComponent data={data} />;
      
      case 'candle':
      default:
        return <CandlestickChartComponent data={data} />;
    }
  };

  return (
    <Card className="mt-3 bg-white border-gray-200 w-full shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-blue-600" />
          <span className="text-gray-900">{title}</span>
        </CardTitle>
        <p className="text-xs text-gray-600 mt-1">{description}</p>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
}
