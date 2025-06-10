'use client';

import { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const COLORS = ['#EF4444', '#10B981']; // red for dropout, green for safe

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Wait for Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  // Fetch dashboard data after auth is confirmed
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard');
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    if (authChecked && user) {
      fetchData();
    } else if (authChecked && !user) {
      setLoading(false); // stop loading if user not signed in
    }
  }, [authChecked, user]);

  if (!authChecked || loading) {
    return <p className="p-6 font-medium text-gray-500">Loading dashboard...</p>;
  }

  if (!user) {
    return (
      <p className="p-6 text-red-600 font-medium">
        You're not logged in. Please sign in to view your dashboard.
      </p>
    );
  }

  if (!data) {
    return <p className="p-6 font-medium text-gray-500">No data available.</p>;
  }

  const pieData = [
    { name: 'Dropout Risk', value: data.dropoutCount },
    { name: 'Safe', value: data.safeCount },
  ];

  const displayName = user.displayName || user.email || 'Guest';

  return (
    <div className="p-8 grid grid-cols-1 xl:grid-cols-2 gap-10 font-inter bg-gray-50 min-h-screen">
      {/* Left Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome, <span className="text-[#2B7FFF]">{displayName}</span>!
          </h2>
          <p className="text-sm text-gray-500 mt-1">Here is your dropout prediction summary.</p>
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Dropout vs Safe Students</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right Section */}
      <div className="space-y-6">
        {/* Bar Chart */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Recent Predictions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.recentPredictions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="studentId" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="probability" name="Dropout Probability" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#FEE2E2] rounded-xl p-4 shadow text-center">
            <h4 className="text-sm text-red-700 font-semibold">At Risk</h4>
            <p className="text-2xl font-bold text-red-800">{data.dropoutCount}</p>
          </div>
          <div className="bg-[#DCFCE7] rounded-xl p-4 shadow text-center">
            <h4 className="text-sm text-green-700 font-semibold">Safe</h4>
            <p className="text-2xl font-bold text-green-800">{data.safeCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
