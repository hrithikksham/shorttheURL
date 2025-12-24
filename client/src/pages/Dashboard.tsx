import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { format } from 'date-fns';
import { ArrowLeft, MousePointer, Smartphone, Chrome, Globe, Clock, Monitor, Command, Laptop } from 'lucide-react';
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

  // 1. Process Traffic Chart
  const chartData = useMemo(() => {
    if (!data?.recentActivity) return [];
    
    const groups: Record<string, number> = {};
    data.recentActivity.forEach(log => {
      const dateObj = new Date(log.createdAt);
      const timeKey = format(dateObj, 'HH:00'); 
      groups[timeKey] = (groups[timeKey] || 0) + 1;
    });

    return Object.keys(groups)
      .map(time => ({ time, clicks: groups[time] }))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [data]);

  // 2. Process Device Data
  const deviceStats = useMemo(() => {
    if (!data?.recentActivity) return [];
    const stats: Record<string, number> = { Desktop: 0, Mobile: 0 };
    
    data.recentActivity.forEach(log => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(log.userAgent);
      if (isMobile) stats.Mobile++;
      else stats.Desktop++;
    });

    return [
      { name: 'Desktop', value: stats.Desktop },
      { name: 'Mobile', value: stats.Mobile },
    ].filter(i => i.value > 0);
  }, [data]);

  // 3. Process Top Browser
  const topBrowser = useMemo(() => {
    if (!data?.recentActivity || data.recentActivity.length === 0) return 'No Data';
    
    const browsers: Record<string, number> = {};
    data.recentActivity.forEach(log => {
      const ua = log.userAgent.toLowerCase();
      let name = 'Other';
      if (ua.includes('chrome')) name = 'Chrome';
      else if (ua.includes('firefox')) name = 'Firefox';
      else if (ua.includes('safari') && !ua.includes('chrome')) name = 'Safari';
      else if (ua.includes('edge')) name = 'Edge';
      
      browsers[name] = (browsers[name] || 0) + 1;
    });

    return Object.keys(browsers).reduce((a, b) => browsers[a] > browsers[b] ? a : b);
  }, [data]);

  const COLORS = ['#3b82f6', '#8b5cf6']; 

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-zinc-500">Initializing...</div>;
  if (error) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-red-400">{error}</div>;

  return (
    // Responsive Padding: px-4 on mobile, px-6 on larger screens
    <div className="min-h-screen bg-[#050505] pt-20 md:pt-24 pb-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        
        {/* Header - Stacks vertically on mobile */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link to="/analytics" className="text-zinc-500 hover:text-white flex items-center gap-2 mb-2 transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Search
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight break-all">
              Analytics for <span className="text-blue-500 font-mono">/{shortCode}</span>
            </h1>
          </div>
          <div className="self-start md:self-auto px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-zinc-400 font-mono">
             Live Data
          </div>
        </div>

        {/* KPI Cards - 1 col Mobile, 2 col Tablet, 3 col Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          
          <div className="glass-panel p-5 md:p-6 rounded-3xl flex items-center gap-5">
            <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400">
              <MousePointer className="w-6 h-6" />
            </div>
            <div>
              <p className="text-zinc-500 text-sm font-medium">Total Clicks</p>
              <p className="text-3xl md:text-4xl font-semibold text-white mt-1">{data?.totalClicks}</p>
            </div>
          </div>

          <div className="glass-panel p-5 md:p-6 rounded-3xl flex items-center gap-5">
            <div className="p-4 bg-orange-500/10 rounded-2xl text-orange-400">
              {topBrowser === 'Chrome' ? <Chrome className="w-6 h-6" /> : 
               topBrowser === 'Safari' ? <Command className="w-6 h-6" /> : 
               <Globe className="w-6 h-6" />}
            </div>
            <div>
              <p className="text-zinc-500 text-sm font-medium">Top Browser</p>
              <p className="text-xl md:text-2xl font-semibold text-white mt-1">{topBrowser}</p>
            </div>
          </div>
          
          {/* Third card (Desktop only placeholder or extra stat) can go here if needed. 
              Currently keeping 2 for neatness or spans on Tablet */}
           <div className="glass-panel p-5 md:p-6 rounded-3xl flex items-center gap-5 sm:col-span-2 lg:col-span-1">
            <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400">
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <p className="text-zinc-500 text-sm font-medium">Platform</p>
              <p className="text-xl md:text-2xl font-semibold text-white mt-1">
                 {/* Simple logic for display, can be enhanced */}
                 {deviceStats[0]?.name || 'Unknown'}
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section - Stacks on Mobile/Tablet */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          
          {/* Main Chart - Takes 2 cols on Desktop, Full on Mobile */}
          <div className="lg:col-span-2 glass-panel p-5 md:p-6 rounded-3xl flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-zinc-200">Traffic Velocity</h3>
              <div className="text-xs text-zinc-500 font-mono">Clicks/Hr</div>
            </div>
            
            {/* Height adjusts slightly based on screen size */}
            <div className="h-[250px] md:h-[300px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#71717a', fontSize: 11}} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#71717a', fontSize: 11}} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', color: '#fff' }}
                      itemStyle={{ color: '#60a5fa' }} 
                      cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="clicks" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorClicks)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                   <p>No traffic recorded yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Device Chart - Full on Mobile, Side on Desktop */}
          <div className="glass-panel p-5 md:p-6 rounded-3xl flex flex-col">
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
                      {deviceStats.map((_, index) => (
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
        <div className="glass-panel p-5 md:p-6 rounded-3xl">
          <h3 className="text-lg font-semibold text-zinc-200 mb-6">Recent Activity Log</h3>
          <div className="space-y-3">
            {data?.recentActivity.map((log, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors gap-3 sm:gap-0">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-zinc-900 text-zinc-400 shrink-0">
                     {log.userAgent.includes('Mobile') ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-200 truncate">
                      {log.userAgent.includes('Mozilla') ? 'Web Browser' : 'Bot/Other'}
                    </p>
                    <p className="text-xs text-zinc-500 font-mono mt-0.5 truncate max-w-[150px] sm:max-w-none">
                      IP: {log.ip || 'Hidden'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5 self-start sm:self-auto">
                  <Clock className="w-3 h-3" />
                  {format(new Date(log.createdAt), 'MMM dd, HH:mm')}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;