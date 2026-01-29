import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { Eye, MousePointer, Star, TrendingUp, BarChart2 } from 'lucide-react';

const ProjectAnalytics = ({ project }) => {
    if (!project || !project.analytics) return null;

    // Process Daily Data
    const dailyData = useMemo(() => {
        if (!project.dailyAnalytics || project.dailyAnalytics.length === 0) {
            // Mock data if empty for visualization demo
            return [
                { date: '2024-01-20', views: 5, clicks: 1 },
                { date: '2024-01-21', views: 12, clicks: 3 },
                { date: '2024-01-22', views: 25, clicks: 8 },
                { date: '2024-01-23', views: 18, clicks: 5 },
                { date: '2024-01-24', views: 35, clicks: 12 },
                { date: 'Today', views: project.analytics.views || 0, clicks: project.analytics.clicks || 0 }
            ];
        }
        //Sort by date
        return [...project.dailyAnalytics].sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [project.dailyAnalytics, project.analytics]);

    const conversionRate = project.analytics.views > 0
        ? ((project.analytics.clicks / project.analytics.views) * 100).toFixed(1)
        : 0;

    const stats = [
        { name: 'Total Views', value: project.analytics.views || 0, icon: <Eye className="w-5 h-5" />, color: 'text-blue-500', bg: 'bg-blue-50' },
        { name: 'Live Clicks', value: project.analytics.clicks || 0, icon: <MousePointer className="w-5 h-5" />, color: 'text-green-500', bg: 'bg-green-50' },
        { name: 'Click Rate', value: `${conversionRate}%`, icon: <TrendingUp className="w-5 h-5" />, color: 'text-purple-500', bg: 'bg-purple-50' },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                        <BarChart2 className="w-6 h-6 text-indigo-600" /> Project Analytics
                    </h3>
                    <p className="text-neutral-500 text-sm mt-1">Track your project's performance and reach.</p>
                </div>
                <div className="text-xs font-bold text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full uppercase tracking-wider">
                    Real-Time
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="flex items-center gap-4 p-5 rounded-xl border border-neutral-100 hover:shadow-md transition-shadow bg-neutral-50/50">
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} shadow-sm`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500 font-medium mb-1">{stat.name}</p>
                            <p className="text-2xl font-bold text-neutral-900 tracking-tight">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Views Chart */}
                <div className="h-72 w-full bg-white p-4 rounded-xl border border-neutral-100 shadow-sm relative overflow-hidden group">
                    {/* Gradient BG Effect */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -z-0"></div>

                    <h4 className="font-bold text-neutral-700 mb-6 z-10 relative">Views Trend</h4>
                    <ResponsiveContainer width="100%" height="80%">
                        <AreaChart data={dailyData}>
                            <defs>
                                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={s => s.slice(5)} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Stars/Clicks Chart */}
                <div className="h-72 w-full bg-white p-4 rounded-xl border border-neutral-100 shadow-sm relative overflow-hidden">
                    <h4 className="font-bold text-neutral-700 mb-6">Engagement</h4>
                    <ResponsiveContainer width="100%" height="80%">
                        <LineChart data={dailyData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={s => s.slice(5)} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="mt-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                    <p className="font-bold text-indigo-900 text-sm">Pro Tip</p>
                    <p className="text-indigo-700 text-sm">
                        Projects with detailed devlogs and high-quality cover images get <strong>2.5x more views</strong> on average. Update your devlog to boost visibility!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProjectAnalytics;
