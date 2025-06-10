'use client';

import { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#EF4444', '#22C55E', '#FACC15', '#3B82F6', '#8B5CF6'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length && payload[0]?.payload) {
    const { name, value } = payload[0].payload;

    // Total value for percentage
    const total = payload.reduce((sum: number, item: any) => sum + item.payload.value, 0);
    const percentage = ((value / total) * 100).toFixed(0);

    return (
      <div className="bg-white border border-gray-300 mt-2 shadow-md p-2 rounded text-sm">
        <p className="font-semibold">{name}</p>
        <p>{value} students</p>
        <p>{percentage}% probability</p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsChart() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    fetch('/api/dashboard/metrics')
      .then((res) => res.json())
      .then((json) => {
        const formatted = json.data.map((item: any) => ({
          name: item.prediction,
          value: item._count.prediction,
        }));
        setData(formatted);
      })
      .catch((err) => console.error('Failed to load analytics:', err));
  }, []);

  return (
    <div className="bg-white rounded-2xl mt-12 shadow-xl p-8 md:p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Prediction Distribution
      </h2>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              innerRadius={60}
              label={({ name, percent }) =>
                `${name} (${Math.round(percent * 100)}%)`
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
