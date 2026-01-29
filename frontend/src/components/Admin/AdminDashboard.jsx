import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Users, Folder, DollarSign, Activity, TrendingUp, Shield, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0, totalProjects: 0, totalRevenue: 0, totalInterviews: 0,
        graphData: []
    });
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, usersRes, projectsRes] = await Promise.all([
                axios.get(`${API_URL}/api/admin/stats`, { withCredentials: true }),
                axios.get(`${API_URL}/api/admin/users`, { withCredentials: true }),
                axios.get(`${API_URL}/api/admin/projects`, { withCredentials: true })
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setProjects(projectsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Ban this user permanently?")) return;
        try {
            await axios.delete(`${API_URL}/api/admin/users/${id}`, { withCredentials: true });
            toast.success("User Banned");
            fetchData();
        } catch (e) { toast.error("Failed"); }
    };

    const deleteProject = async (id) => {
        if (!window.confirm("Delete this project?")) return;
        try {
            await axios.delete(`${API_URL}/api/admin/projects/${id}`, { withCredentials: true });
            toast.success("Project Deleted");
            fetchData();
        } catch (e) { toast.error("Failed"); }
    };

    const filteredUsers = users.filter(u => u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredProjects = projects.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">Loading Command Center...</div>;

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white pb-12 transition-colors duration-300">
            {/* Header */}
            <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-10 glass dark:glass-dark">
                <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Shield className="text-indigo-600" /> Admin Super-Dashboard
                    </h1>
                    <div className="flex gap-2">
                        {['overview', 'users', 'projects'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg font-bold capitalize transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-fade-in">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                                { label: 'Total Projects', value: stats.totalProjects, icon: Folder, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                                { label: 'Total Revenue', value: stats.totalRevenue ? `₹${stats.totalRevenue.toLocaleString()}` : '₹0', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
                                { label: 'Interviews', value: stats.totalInterviews, icon: Activity, color: 'text-orange-500', bg: 'bg-orange-500/10' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                                            <stat.icon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400">{stat.label}</p>
                                            <p className="text-3xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <TrendingUp className="text-green-500" /> Revenue Growth
                                </h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={stats.graphData || []}>
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                                            <XAxis dataKey="name" stroke="#888" />
                                            <YAxis stroke="#888" />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Area type="monotone" dataKey="revenue" stroke="#4f46e5" fillOpacity={1} fill="url(#colorRevenue)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <Activity className="text-blue-500" /> Recent Registrations
                                </h3>
                                <div className="space-y-4">
                                    {users.slice(0, 5).map(u => (
                                        <div key={u._id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400">
                                                    {u.fullName[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{u.fullName}</p>
                                                    <p className="text-xs text-neutral-500">{u.role}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-neutral-400">{new Date(u.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {(activeTab === 'users' || activeTab === 'projects') && (
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden animate-fade-in">
                        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-4">
                            <Search className="text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-transparent outline-none flex-1 text-neutral-900 dark:text-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                                    <tr>
                                        <th className="p-4">Name/Title</th>
                                        <th className="p-4">{activeTab === 'users' ? 'Role' : 'Owner'}</th>
                                        <th className="p-4">Details</th>
                                        <th className="p-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {(activeTab === 'users' ? filteredUsers : filteredProjects).map(item => (
                                        <tr key={item._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    {activeTab === 'users' && <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-bold">{item.fullName[0]}</div>}
                                                    <div>
                                                        <p className="font-bold text-neutral-900 dark:text-white">{activeTab === 'users' ? item.fullName : item.title}</p>
                                                        <p className="text-xs text-neutral-500">{activeTab === 'users' ? item.email : `₹${item.price}`}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-neutral-600 dark:text-neutral-300">
                                                {activeTab === 'users' ? (
                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${item.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{item.role}</span>
                                                ) : item.owner?.username}
                                            </td>
                                            <td className="p-4 text-xs text-neutral-500">
                                                {activeTab === 'users' ? `Joined: ${new Date(item.createdAt).toLocaleDateString()}` : `${item.stars || 0} Stars • ${item.analytics?.views || 0} Views`}
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => activeTab === 'users' ? deleteUser(item._id) : deleteProject(item._id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Delete/Ban"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
