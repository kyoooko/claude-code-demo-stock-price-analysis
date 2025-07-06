import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { StockPriceHistory } from '../types/stock';

interface StockChartProps {
  data: StockPriceHistory[];
}

const StockChart: React.FC<StockChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric'
    })
  }));

  const minPrice = Math.min(...data.map(d => d.low));
  const maxPrice = Math.max(...data.map(d => d.high));
  const avgPrice = data.reduce((sum, d) => sum + d.close, 0) / data.length;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: 'white',
          padding: '12px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{`日付: ${label}`}</p>
          <p style={{ margin: '4px 0', color: '#3498db' }}>{`始値: $${payload[0].payload.open.toFixed(2)}`}</p>
          <p style={{ margin: '4px 0', color: '#e74c3c' }}>{`高値: $${payload[0].payload.high.toFixed(2)}`}</p>
          <p style={{ margin: '4px 0', color: '#27ae60' }}>{`安値: $${payload[0].payload.low.toFixed(2)}`}</p>
          <p style={{ margin: '4px 0', color: '#2c3e50' }}>{`終値: $${payload[0].value.toFixed(2)}`}</p>
          <p style={{ margin: '4px 0 0 0', color: '#7f8c8d' }}>{`出来高: ${payload[0].payload.volume.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#7f8c8d"
            fontSize={12}
            tick={{ fill: '#7f8c8d' }}
          />
          <YAxis 
            domain={[minPrice * 0.98, maxPrice * 1.02]}
            stroke="#7f8c8d"
            fontSize={12}
            tick={{ fill: '#7f8c8d' }}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <ReferenceLine 
            y={avgPrice} 
            stroke="#95a5a6" 
            strokeDasharray="5 5" 
            label="平均価格"
          />
          <Line 
            type="monotone" 
            dataKey="close" 
            stroke="#3498db" 
            strokeWidth={2}
            dot={{ fill: '#3498db', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: '#3498db', strokeWidth: 2 }}
            name="終値"
          />
          <Line 
            type="monotone" 
            dataKey="high" 
            stroke="#e74c3c" 
            strokeWidth={1}
            dot={false}
            strokeDasharray="3 3"
            name="高値"
          />
          <Line 
            type="monotone" 
            dataKey="low" 
            stroke="#27ae60" 
            strokeWidth={1}
            dot={false}
            strokeDasharray="3 3"
            name="安値"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;