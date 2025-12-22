import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ArrowLeft, MousePointer, Clock, Globe } from 'lucide-react';
import apiClient from '../services/apiClient';

interface AnalyticsData {
  totalClicks: number;
  recentActivity: Array<{
    createdAt: string;
    userAgent: string;
    ip?: string;
  }>;
}

const Dashboard = () => {
  const { shortCode } = useParams();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient.get(`/api/analytics/${shortCode}`);
        setData(res.data);
      } catch (err) {
        setError('Could not load analytics. The link might not exist.');
      } finally {
        setLoading(false);
      }
    };

    if (shortCode) fetchStats();
  }, [shortCode]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading stats...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  // Prepare data for the chart (Group clicks by hour/day if needed, here simplifying)
  // For this demo, we just map recent activity to simple data points
  const chartData = data?.recentActivity.map((log, index) => ({
    name: `Click ${index + 1}`,
    time: format(new Date(log.createdAt), 'HH:mm'),
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-gray-500 hover:text-blue-600 flex items-center gap-2 mb-4 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics for <span className="text-blue-600">/{shortCode}</span>
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Clicks Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <MousePointer className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Clicks</p>
              <p className="text-3xl font-bold text-gray-900">{data?.totalClicks}</p>
            </div>
          </div>
          
          {/* Placeholder for future stats */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 opacity-50">
             <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <Globe className="w-8 h-8" />
            </div>
             <div>
              <p className="text-sm text-gray-500 font-medium">Top Locations</p>
              <p className="text-sm text-gray-400">Coming Soon</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Traffic Overview</h3>
            <div className="h-64">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="name" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  No data to display yet
                </div>
              )}
            </div>
          </div>

          {/* Right: Recent Log List */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Visitors</h3>
            <div className="space-y-4">
              {data?.recentActivity.map((log, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {log.userAgent.includes('Mozilla') ? 'Web Browser' : 'Bot/Other'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(log.createdAt), 'PP p')}
                    </p>
                  </div>
                </div>
              ))}
              {data?.recentActivity.length === 0 && (
                <p className="text-sm text-gray-400">No recent clicks recorded.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;