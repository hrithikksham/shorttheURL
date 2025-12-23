import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import { ArrowLeft, MousePointer, Smartphone, Globe, Clock, Monitor } from 'lucide-react';
import apiClient from '../services/apiClient';

// Types
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

  // Process Chart Data
  const chartData = useMemo(() => {
    if (!data?.recentActivity) return [];
    return data.recentActivity.map((log, index) => ({
      name: `Visit ${index + 1}`,
      time: format(new Date(log.createdAt), 'HH:mm'),
    }));
  }, [data]);

  // Process Device Data (FIXED: No external library needed)
  const deviceStats = useMemo(() => {
    if (!data?.recentActivity) return [];
    const stats: Record<string, number> = { Desktop: 0, Mobile: 0 };
    
    data.recentActivity.forEach(log => {
      // Simple Regex check for mobile devices
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(log.userAgent);
      
      if (isMobile) stats.Mobile++;
      else stats.Desktop++;
    });

    return [
      { name: 'Desktop', value: stats.Desktop },
      { name: 'Mobile', value: stats.Mobile },
    ].filter(i => i.value > 0);
  }, [data]);

  const COLORS = ['#3b82f6', '#8b5cf6']; // Blue & Purple

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-zinc-500">Initializing...</div>;
  if (error) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link to="/" className="text-zinc-500 hover:text-white flex items-center gap-2 mb-2 transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Creator
            </Link>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Analytics for <span className="text-blue-500 font-mono">/{shortCode}</span>
            </h1>
          </div>
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-zinc-400 font-mono">
             Live Data
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-3xl flex items-center gap-5">
            <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400">
              <MousePointer className="w-6 h-6" />
            </div>
            <div>
              <p className="text-zinc-500 text-sm font-medium">Total Clicks</p>
              <p className="text-4xl font-semibold text-white mt-1">{data?.totalClicks}</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl flex items-center gap-5 opacity-75">
            <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <p className="text-zinc-500 text-sm font-medium">Top Location</p>
              <p className="text-xl font-semibold text-white mt-1">Unknown</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Bar Chart */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl">
            <h3 className="text-lg font-semibold text-zinc-200 mb-6">Traffic Velocity</h3>
            <div className="h-[300px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="time" stroke="#52525b" tick={{fill: '#71717a', fontSize: 12}} tickLine={false} axisLine={false} />
                    <YAxis stroke="#52525b" tick={{fill: '#71717a', fontSize: 12}} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: '#fff' }}
                      itemStyle={{ color: '#e4e4e7' }}
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    />
                    <Bar dataKey="name" fill="#3b82f6" radius={[4, 4, 4, 4]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                   <p>No traffic recorded yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Device Pie Chart */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col">
            <h3 className="text-lg font-semibold text-zinc-200 mb-6">Device Breakdown</h3>
            <div className="flex-1 h-[250px] w-full relative">
               {deviceStats.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {deviceStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
               ) : (
                 <div className="absolute inset-0 flex items-center justify-center text-zinc-600">No data</div>
               )}
            </div>
            <div className="flex justify-center gap-6 mt-4">
               <div className="flex items-center gap-2 text-sm text-zinc-400">
                 <div className="w-3 h-3 rounded-full bg-blue-500"></div> Desktop
               </div>
               <div className="flex items-center gap-2 text-sm text-zinc-400">
                 <div className="w-3 h-3 rounded-full bg-purple-500"></div> Mobile
               </div>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="text-lg font-semibold text-zinc-200 mb-6">Recent Activity Log</h3>
          <div className="space-y-3">
            {data?.recentActivity.map((log, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-zinc-900 text-zinc-400">
                     {log.userAgent.includes('Mobile') ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">
                      {log.userAgent.includes('Mozilla') ? 'Web Browser' : 'Bot/Other'}
                    </p>
                    <p className="text-xs text-zinc-500 font-mono mt-0.5">IP: {log.ip || 'Hidden'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                  <Clock className="w-3 h-3" />
                  {format(new Date(log.createdAt), 'MMM dd, HH:mm')}
                </div>
              </div>
            ))}
            {(!data?.recentActivity || data.recentActivity.length === 0) && (
              <div className="text-center py-8 text-zinc-600">No recent activity found</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;