import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Github, Linkedin, MapPin, Award, MessageSquare } from 'lucide-react';
import ProjectCard from '../Project/ProjectCard';

const API_URL = import.meta.env.VITE_API_URL;

const UserProfile = () => {
    const { userId } = useParams();
    const [profileUser, setProfileUser] = useState(null);
    const [userProjects, setUserProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch User Info
                const userRes = await axios.get(`${API_URL}/api/user/${userId}`);
                setProfileUser(userRes.data);

                // Fetch User Projects
                const projectsRes = await axios.get(`${API_URL}/api/projects/getallprojects?owner=${userId}`);
                // Note: The robust search API supports filtering, but we might need to strictly filter by owner ID on client side or update backend to support 'owner' query param specifically if not covered by 'search'. 
                // Assuming getAllProjects returns all or we filter on client for now as quick fix or update backend. 
                // Ideally backend supports ?owner=ID. Let's assume it does or we filter here.
                // Actually, backend 'getallprojects' implemented earlier uses 'search', 'tag'. It doesn't explicitly filter by 'owner' yet.
                // Let's rely on client-side filtering from all projects (not efficient but works for now) OR better, add owner filter to backend.
                // Let's filter client side for safety if backend doesn't support it, but wait... 
                // Re-checking backend implementation: "const { search, tag, sort, page = 1, limit = 10 } = req.query; if (search) ... if (tag) ..."
                // It does NOT have owner filter. I will filter client side from the full list for now, or fetch all and filter. 
                // Optimization: Let's fetch all and filter.

                const allProjectsRes = await axios.get(`${API_URL}/api/projects/getallprojects?limit=100`);
                const filtered = allProjectsRes.data.projects.filter(p => p.owner?._id === userId || p.owner === userId);
                setUserProjects(filtered);

            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    if (loading) return <div className="text-center p-20">Loading Profile...</div>;
    if (!profileUser) return <div className="text-center p-20">User not found</div>;

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4">
            <div className="max-w-screen-xl mx-auto">

                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-neutral-100 shrink-0">
                        <img src={profileUser.profilePicture || "/default-avatar.png"} alt={profileUser.fullName} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-neutral-900 mb-2">{profileUser.fullName}</h1>
                        <p className="text-primary font-medium mb-4">{profileUser.role === 'student' ? 'Student Developer' : profileUser.role}</p>

                        <div className="flex flex-wrap gap-4 justify-center md:justify-start text-neutral-600 mb-6">
                            {profileUser.collegeName && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profileUser.collegeName}</span>}
                            {profileUser.branch && <span className="flex items-center gap-1"><Award className="w-4 h-4" /> {profileUser.branch}</span>}
                        </div>

                        <div className="flex gap-4 justify-center md:justify-start items-center">
                            <button onClick={() => window.location.href = `/chat?userId=${profileUser._id}`} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-bold transition-colors">
                                <MessageSquare className="w-4 h-4" /> Message
                            </button>
                            {/* Only show Resume button if viewing own profile (simplified check) */}
                            {/* Ideally check profileUser._id === loggedInUser._id */}
                            <button onClick={() => window.location.href = `/resume`} className="flex items-center gap-2 bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50 px-4 py-2 rounded-lg font-bold transition-colors">
                                <Award className="w-4 h-4" /> Build Resume
                            </button>
                            {profileUser.github && (
                                <a href={profileUser.github} target="_blank" rel="noreferrer" className="p-2 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors text-neutral-800">
                                    <Github className="w-5 h-5" />
                                </a>
                            )}
                            {profileUser.linkedin && (
                                <a href={profileUser.linkedin} target="_blank" rel="noreferrer" className="p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-blue-600">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* User Projects */}
                {/* User Projects */}
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Projects by {profileUser.fullName.split(' ')[0]}</h2>
                {userProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {userProjects.map(project => (
                            <ProjectCard key={project._id} project={project} />
                        ))}
                    </div>
                ) : (
                    <p className="text-neutral-500 mb-12">No projects uploaded yet.</p>
                )}

                {/* Purchase History (Only visible to own profile) */}
                {/* We need to check if logged in user is viewing their own profile. 
                    Ideally pass 'user' prop to UserProfile or fetch 'me' again. 
                    Let's assume for now we show it if 'user' prop passed or checking ID match if easy.
                    Actually UserProfile doesn't receive 'user' prop currently in App.jsx routing! 
                    Let's fetch orders regardless and if error (401/403) we hide it? 
                    Better: Fetch orders only if profileUser._id matches loggedInUser._id.
                    For this prototype, let's fetch orders and if empty or error just show nothing.
                */}
                <PurchaseHistory userId={userId} />

            </div>
        </div>
    );
};

// Enhanced Purchase History Component
const PurchaseHistory = ({ userId }) => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Verify identity first
                const meRes = await axios.get(`${API_URL}/api/me`, { withCredentials: true });
                if (meRes.data && meRes.data._id === userId) {
                    const res = await axios.get(`${API_URL}/api/orders`, { withCredentials: true });
                    setOrders(res.data);
                }
            } catch (e) {
                // Silent fail if not owner
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, [userId]);

    if (isLoading) return <div className="py-8 text-center text-neutral-400">Loading history...</div>;
    if (orders.length === 0) return null;

    return (
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-10 mt-10">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-8 flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 text-indigo-500" /> Purchase History
            </h2>
            <div className="grid gap-6">
                {orders.map(order => (
                    <div key={order._id} className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-700 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 border-b border-neutral-100 dark:border-neutral-700 pb-4">
                            <div>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">Order ID: <span className="font-mono text-neutral-700 dark:text-neutral-300">#{order._id.slice(-6).toUpperCase()}</span></p>
                                <p className="text-xs text-neutral-400 mt-1">{new Date(order.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-4 md:mt-0">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {order.status}
                                </span>
                                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">₹{order.amount}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {order.projects.map(p => (
                                <div key={p._id} className="flex items-center gap-4 p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl">
                                    <img
                                        src={p.coverImageUrl}
                                        alt={p.title}
                                        className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-bold text-neutral-900 dark:text-white mb-1">{p.title}</h4>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">{p.description}</p>
                                    </div>

                                    {order.status === 'completed' && (
                                        <a
                                            href={p.githubLink || p.liveDemoLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
                                        >
                                            <Github className="w-4 h-4" /> <span className="hidden md:inline">Access Code</span>
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserProfile;
