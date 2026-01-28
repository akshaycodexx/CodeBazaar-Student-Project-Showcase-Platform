import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Github, Linkedin, MapPin, Award } from 'lucide-react';
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

                        <div className="flex gap-4 justify-center md:justify-start">
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
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Projects by {profileUser.fullName.split(' ')[0]}</h2>
                {userProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {userProjects.map(project => (
                            <ProjectCard key={project._id} project={project} />
                        ))}
                    </div>
                ) : (
                    <p className="text-neutral-500">No projects uploaded yet.</p>
                )}

            </div>
        </div>
    );
};

export default UserProfile;
