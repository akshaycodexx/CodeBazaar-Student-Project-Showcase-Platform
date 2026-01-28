import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Users, Folder, DollarSign, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
    const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

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
            // toast.error("Failed to load admin data"); // Suppress if 403 (not admin)
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Ban this user?")) return;
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

    if (loading) return <div className="p-10 text-center">Loading Admin Panel...</div>;

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-neutral-900 mb-8">Admin Super-Dashboard 🛡️</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-full"><Users /></div>
                            <div><p className="text-sm text-neutral-500">Total Users</p><p className="text-2xl font-bold">{stats.totalUsers}</p></div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-full"><Folder /></div>
                            <div><p className="text-sm text-neutral-500">Total Projects</p><p className="text-2xl font-bold">{stats.totalProjects}</p></div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-50 text-green-600 rounded-full"><DollarSign /></div>
                            <div><p className="text-sm text-neutral-500">Revenue</p><p className="text-2xl font-bold">₹{stats.totalRevenue?.toLocaleString()}</p></div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-50 text-orange-600 rounded-full"><Activity /></div>
                            <div><p className="text-sm text-neutral-500">Interviews</p><p className="text-2xl font-bold">{stats.totalInterviews}</p></div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'overview' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-600'}`}>Overview</button>
                    <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'users' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-600'}`}>Manage Users</button>
                    <button onClick={() => setActiveTab('projects')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'projects' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-600'}`}>Manage Projects</button>
                </div>

                {/* User Content */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-50 border-b border-neutral-200">
                                <tr>
                                    <th className="p-4 font-semibold text-neutral-600">User</th>
                                    <th className="p-4 font-semibold text-neutral-600">Role</th>
                                    <th className="p-4 font-semibold text-neutral-600">Created</th>
                                    <th className="p-4 font-semibold text-neutral-600">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id} className="border-b border-neutral-100 hover:bg-neutral-50">
                                        <td className="p-4 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center font-bold text-xs">{u.fullName[0]}</div>
                                            <div>
                                                <div className="font-bold text-neutral-900">{u.fullName}</div>
                                                <div className="text-xs text-neutral-500">{u.email}</div>
                                            </div>
                                        </td>
                                        <td className="p-4"><span className="bg-neutral-100 px-2 py-1 rounded text-xs uppercase font-bold">{u.role}</span></td>
                                        <td className="p-4 text-sm text-neutral-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <button onClick={() => deleteUser(u._id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Project Content */}
                {activeTab === 'projects' && (
                    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-50 border-b border-neutral-200">
                                <tr>
                                    <th className="p-4 font-semibold text-neutral-600">Project</th>
                                    <th className="p-4 font-semibold text-neutral-600">Owner</th>
                                    <th className="p-4 font-semibold text-neutral-600">Stats</th>
                                    <th className="p-4 font-semibold text-neutral-600">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map(p => (
                                    <tr key={p._id} className="border-b border-neutral-100 hover:bg-neutral-50">
                                        <td className="p-4 font-bold text-neutral-900">{p.title}</td>
                                        <td className="p-4 text-sm">{p.owner?.username || "Unknown"}</td>
                                        <td className="p-4 text-xs text-neutral-500">
                                            {p.analytics?.views || 0} Views • {p.stars || 0} Stars
                                        </td>
                                        <td className="p-4">
                                            <button onClick={() => deleteProject(p._id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
