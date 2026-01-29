import React, { useRef, useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Download, Mail, Phone, MapPin, Github, Linkedin, ExternalLink, Sparkles, Wand2 } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;



export default ResumeBuilder;

const ResumeBuilder = ({ user }) => {
    const [profile, setProfile] = useState(user || null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aiLoading, setAiLoading] = useState(false);
    const [summary, setSummary] = useState("Software Developer passionate about building scalable web applications.");
    const [editableProjects, setEditableProjects] = useState([]);

    const componentRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                let currentUser = profile;
                if (!currentUser) {
                    const res = await axios.get(`${API_URL}/api/me`, { withCredentials: true });
                    currentUser = res.data;
                    setProfile(currentUser);
                    setSummary(currentUser.headline || "Software Developer passionate about building scalable web applications.");
                }

                const allProjectsRes = await axios.get(`${API_URL}/api/projects/getallprojects?limit=100`);
                const userProjects = allProjectsRes.data.projects.filter(p => p.owner?._id === currentUser._id || p.owner === currentUser._id);
                setProjects(userProjects);
                setEditableProjects(userProjects.slice(0, 4).map(p => ({ ...p, enhancedDescription: p.description })));

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
        documentTitle: `${profile?.fullName?.replace(/\s+/g, '_')}_Resume`,
    });

    const generateAiSummary = async () => {
        setAiLoading(true);
        try {
            const res = await axios.post(`${API_URL}/api/ai/summary`, {
                skills: profile.skills,
                projects: editableProjects.map(p => p.title).join(", "),
                experience: profile.experience || "Fresh Graduate"
            }, { withCredentials: true });

            setSummary(res.data.summary);
            toast.success("Summary Generated!");
        } catch (err) {
            toast.error("AI Generation Failed");
        } finally {
            setAiLoading(false);
        }
    };

    const enhanceDescription = async (index, text) => {
        const toastId = toast.loading("Enhancing...");
        try {
            const res = await axios.post(`${API_URL}/api/ai/enhance`, { text }, { withCredentials: true });
            const newProjects = [...editableProjects];
            newProjects[index].enhancedDescription = res.data.enhancedText;
            setEditableProjects(newProjects);
            toast.success("Enhanced!", { id: toastId });
        } catch (err) {
            toast.error("Enhancement Failed", { id: toastId });
        }
    };

    if (loading) return <div className="text-center p-20">Loading Resume Builder...</div>;
    if (!profile) return <div className="text-center p-20">Please log in to build your resume.</div>;

    return (
        <div className="min-h-screen bg-neutral-100 py-12 px-4">
            <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-800 flex items-center gap-2">
                        <Sparkles className="text-indigo-600" /> AI Resume Builder
                    </h1>
                    <p className="text-neutral-500">Edit fields directly in the preview below. Use AI to polisih your content.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-neutral-900 hover:bg-black text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all"
                    >
                        <Download className="w-5 h-5" /> Download PDF
                    </button>
                </div>
            </div>

            {/* Resume Preview */}
            <div className="max-w-[210mm] mx-auto bg-white shadow-2xl min-h-[297mm] group" ref={componentRef}>
                {/* Header */}
                <div className="bg-neutral-900 text-white p-12 relative">
                    <h1 className="text-4xl font-bold uppercase tracking-wider mb-2" contentEditable suppressContentEditableWarning>
                        {profile.fullName}
                    </h1>

                    <div className="relative group/summary">
                        <p className="text-lg text-neutral-300 mb-6 w-full outline-none border-b border-transparent hover:border-neutral-700 transition-colors" contentEditable suppressContentEditableWarning onBlur={(e) => setSummary(e.target.innerText)}>
                            {summary}
                        </p>
                        <button
                            onClick={generateAiSummary}
                            disabled={aiLoading}
                            className="absolute -top-8 right-0 text-xs bg-indigo-600 text-white px-2 py-1 rounded opacity-0 group-hover/summary:opacity-100 transition-opacity flex items-center gap-1"
                        >
                            {aiLoading ? <Wand2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />} AI Write
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-6 text-sm text-neutral-300">
                        <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {profile.email}</div>
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {profile.mobile || "+91 98765 43210"}</div>
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
                                <h3 className="font-bold text-lg" contentEditable suppressContentEditableWarning>{profile.collegeName || "University Name"}</h3>
                                <p className="text-neutral-600 italic" contentEditable suppressContentEditableWarning>{profile.branch || "Computer Science"} (2020 - 2024)</p>
                            </div>
                        </section>

                        {/* Projects */}
                        <section>
                            <h2 className="text-xl font-bold text-neutral-900 border-b-2 border-primary pb-2 mb-4 uppercase">Key Projects</h2>
                            <div className="space-y-6">
                                {editableProjects.map((project, index) => (
                                    <div key={project._id} className="relative group/project">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-lg" contentEditable suppressContentEditableWarning>{project.title}</h3>
                                            <div className="flex gap-2 text-xs print:hidden">
                                                {project.demoLink && <a href={project.demoLink} target="_blank" className="text-primary hover:underline"><ExternalLink className="w-3 h-3" /></a>}
                                            </div>
                                        </div>

                                        <div className="relative mt-1">
                                            <p
                                                className="text-sm text-neutral-700 leading-relaxed outline-none border-l-2 border-transparent hover:border-indigo-200 pl-1 -ml-1 transition-colors"
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => {
                                                    const newProjects = [...editableProjects];
                                                    newProjects[index].enhancedDescription = e.target.innerText;
                                                    setEditableProjects(newProjects);
                                                }}
                                            >
                                                {project.enhancedDescription}
                                            </p>
                                            <button
                                                onClick={() => enhanceDescription(index, project.enhancedDescription)}
                                                className="absolute top-0 right-0 -translate-y-full text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded opacity-0 group-hover/project:opacity-100 transition-opacity flex items-center gap-1 hover:bg-indigo-100 cursor-pointer print:hidden"
                                                title="Rewrite with AI"
                                            >
                                                <Sparkles className="w-3 h-3" /> Enhance
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {project.tags && project.tags.slice(0, 4).map((tag, i) => (
                                                <span key={i} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {editableProjects.length === 0 && <p className="text-neutral-500 italic">No projects found.</p>}
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
                                    <span key={i} className="bg-neutral-100 text-neutral-800 px-3 py-1 rounded font-medium text-sm block w-full text-center" contentEditable suppressContentEditableWarning>{skill}</span>
                                ))}
                            </div>
                        </section>

                        {/* Achievements */}
                        <section>
                            <h2 className="text-xl font-bold text-neutral-900 border-b-2 border-primary pb-2 mb-4 uppercase">Achievements</h2>
                            <ul className="list-disc list-inside space-y-2 text-sm text-neutral-700">
                                {profile.badges && profile.badges.length > 0 ? profile.badges.map((badge, i) => (
                                    <li key={i} contentEditable suppressContentEditableWarning>{badge}</li>
                                )) : (
                                    <>
                                        <li contentEditable suppressContentEditableWarning>Algorithm Expert (500+ solved)</li>
                                        <li contentEditable suppressContentEditableWarning>Open Source Contributor</li>
                                    </>
                                )}
                            </ul>
                        </section>
                    </div>
                </div>
            </div>

            <style>
                {`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #resume-content, #resume-content * {
                            visibility: visible;
                        }
                        .print\\:hidden {
                            display: none !important;
                        }
                    }
                `}
            </style>
        </div>
    );
};
