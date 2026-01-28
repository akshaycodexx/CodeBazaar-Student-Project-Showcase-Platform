import React, { useRef, useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import { Download, Mail, Phone, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react';
import { useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const ResumeBuilder = ({ user }) => {
    // If user prop is not passed (direct link), attempt to fetch based on param or 'me'
    // For simplicity, we assume this is accessed via "My Profile" -> "Build Resume" so 'user' might be available or we fetch 'me'.
    // Or we fetch public profile if userId param exists.

    const [profile, setProfile] = useState(user || null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const componentRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // If we don't have a user, fetch 'me'
                let currentUser = profile;
                if (!currentUser) {
                    const res = await axios.get(`${API_URL}/api/me`, { withCredentials: true });
                    currentUser = res.data;
                    setProfile(currentUser);
                }

                // Fetch User Projects
                const allProjectsRes = await axios.get(`${API_URL}/api/projects/getallprojects?limit=100`);
                const userProjects = allProjectsRes.data.projects.filter(p => p.owner?._id === currentUser._id || p.owner === currentUser._id);
                setProjects(userProjects);

            } catch (err) {
                console.error("Error fetching data for resume", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `${profile?.fullName}_Resume` || 'Resume',
    });

    if (loading) return <div className="text-center p-20">Generating Resume...</div>;
    if (!profile) return <div className="text-center p-20">Please log in to build your resume.</div>;

    return (
        <div className="min-h-screen bg-neutral-100 py-12 px-4">
            <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-neutral-800">AI Resume Builder</h1>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all"
                >
                    <Download className="w-5 h-5" /> Download PDF
                </button>
            </div>

            {/* Resume Preview */}
            <div className="max-w-[210mm] mx-auto bg-white shadow-2xl min-h-[297mm]" ref={componentRef}>
                {/* Header */}
                <div className="bg-neutral-900 text-white p-12">
                    <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">{profile.fullName}</h1>
                    <p className="text-xl text-neutral-400 font-medium mb-6">Software Developer</p>

                    <div className="flex flex-wrap gap-6 text-sm text-neutral-300">
                        <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {profile.email}</div>
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {profile.mobile || "N/A"}</div>
                        {profile.github && <div className="flex items-center gap-2"><Github className="w-4 h-4" /> {profile.github.replace('https://', '')}</div>}
                        {profile.linkedin && <div className="flex items-center gap-2"><Linkedin className="w-4 h-4" /> {profile.linkedin.replace('https://', '')}</div>}
                    </div>
                </div>

                <div className="p-12 grid grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="col-span-2 space-y-8">
                        {/* Education */}
                        <section>
                            <h2 className="text-xl font-bold text-neutral-900 border-b-2 border-primary pb-2 mb-4 uppercase">Education</h2>
                            <div>
                                <h3 className="font-bold text-lg">{profile.collegeName || "University Name"}</h3>
                                <p className="text-neutral-600 italic">{profile.branch || "Computer Science"}</p>
                                {/* <p className="text-sm text-neutral-500 mt-1">2020 - 2024</p> */}
                            </div>
                        </section>

                        {/* Projects */}
                        <section>
                            <h2 className="text-xl font-bold text-neutral-900 border-b-2 border-primary pb-2 mb-4 uppercase">Key Projects</h2>
                            <div className="space-y-6">
                                {projects.slice(0, 4).map(project => (
                                    <div key={project._id}>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-lg">{project.title}</h3>
                                            <div className="flex gap-2 text-xs">
                                                {project.demoLink && <a href={project.demoLink} className="text-primary hover:underline">Live Demo</a>}
                                                {project.githubLink && <a href={project.githubLink} className="text-neutral-500 hover:underline">GitHub</a>}
                                            </div>
                                        </div>
                                        <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{project.description}</p>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {project.tags && project.tags.slice(0, 4).map((tag, i) => (
                                                <span key={i} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {projects.length === 0 && <p className="text-neutral-500 italic">No projects found. Upload projects to populate this section.</p>}
                            </div>
                        </section>
                    </div>

                    {/* Right Column */}
                    <div className="col-span-1 space-y-8">
                        {/* Skills */}
                        <section>
                            <h2 className="text-xl font-bold text-neutral-900 border-b-2 border-primary pb-2 mb-4 uppercase">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {(profile.skills && profile.skills.length > 0 ? profile.skills : ["JavaScript", "React", "Node.js", "MongoDB", "Git"]).map((skill, i) => (
                                    <span key={i} className="bg-neutral-100 text-neutral-800 px-3 py-1 rounded font-medium text-sm block w-full text-center">{skill}</span>
                                ))}
                            </div>
                        </section>

                        {/* Badges / Achievements */}
                        <section>
                            <h2 className="text-xl font-bold text-neutral-900 border-b-2 border-primary pb-2 mb-4 uppercase">Achievements</h2>
                            <ul className="list-disc list-inside space-y-2 text-sm text-neutral-700">
                                {profile.badges && profile.badges.length > 0 ? profile.badges.map((badge, i) => (
                                    <li key={i}>{badge}</li>
                                )) : (
                                    <>
                                        <li>Hackathon Participant</li>
                                        <li>Active Contributor</li>
                                    </>
                                )}
                                {profile.points > 100 && <li>Top Rated Developer ({profile.points} pts)</li>}
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;
