import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

const Dashboard = ({ user }) => {
    // Mock Data for Analytics
    const revenueData = [
        { name: 'Jan', revenue: 4000 },
        { name: 'Feb', revenue: 3000 },
        { name: 'Mar', revenue: 2000 },
        { name: 'Apr', revenue: 2780 },
        { name: 'May', revenue: 1890 },
        { name: 'Jun', revenue: 2390 },
        { name: 'Jul', revenue: 3490 },
    ];

    const viewsData = [
        { name: 'Mon', views: 400 },
        { name: 'Tue', views: 300 },
        { name: 'Wed', views: 200 },
        { name: 'Thu', views: 278 },
        { name: 'Fri', views: 189 },
        { name: 'Sat', views: 239 },
        { name: 'Sun', views: 349 },
    ];

    if (!user) return <div className="text-center p-10">Please log in to view dashboard.</div>;

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4">
            <div className="max-w-screen-xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900">Welcome, {user.fullName}!</h1>
                    <p className="text-neutral-500">Here is your project status track record.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 rounded-lg text-primary"><DollarSign /></div>
                        <div>
                            <p className="text-sm text-neutral-500">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-neutral-900">₹12,450</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 flex items-center gap-4">
                        <div className="p-3 bg-green-50 rounded-lg text-green-600"><Users /></div>
                        <div>
                            <p className="text-sm text-neutral-500">Total Sales</p>
                            <h3 className="text-2xl font-bold text-neutral-900">45</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><Activity /></div>
                        <div>
                            <p className="text-sm text-neutral-500">Project Views</p>
                            <h3 className="text-2xl font-bold text-neutral-900">1,208</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 flex items-center gap-4">
                        <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600"><TrendingUp /></div>
                        <div>
                            <p className="text-sm text-neutral-500">Growth</p>
                            <h3 className="text-2xl font-bold text-neutral-900">+12.5%</h3>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Revenue Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                        <h3 className="text-lg font-bold text-neutral-900 mb-6">Monthly Revenue</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Views Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                        <h3 className="text-lg font-bold text-neutral-900 mb-6">Weekly Views</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={viewsData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="views" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
