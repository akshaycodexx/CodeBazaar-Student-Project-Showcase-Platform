import React, { useEffect, useState } from 'react';
import { Briefcase, MapPin, DollarSign, Building, Search } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const JobBoard = ({ user }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const navigate = useNavigate();

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/jobs`);
            setJobs(res.data);
        } catch (err) {
            console.error("Failed to fetch jobs");
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (jobId) => {
        if (!user) return toast.error("Login to apply");
        try {
            await axios.post(`${API_URL}/api/jobs/${jobId}/apply`, {}, { withCredentials: true });
            toast.success("Applied Successfully!");
            // Update local state to show applied
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to apply");
        }
    };

    const filteredJobs = filter === "All" ? jobs : jobs.filter(j => j.type === filter);

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900">Job Board</h1>
                        <p className="text-neutral-500">Find your dream internship or full-time role.</p>
                    </div>
                    {user && (user.role === 'recruiter' || user.role === 'recuritor') && (
                        <button onClick={() => navigate('/post-job')} className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-transform hover:-translate-y-1">
                            + Post a Job
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                    {["All", "Internship", "Full-time", "Part-time"].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${filter === type ? 'bg-neutral-900 text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-20">Loading Jobs...</div>
                ) : (
                    <div className="grid gap-6">
                        {filteredJobs.map(job => (
                            <div key={job._id} className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6">
                                <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center shrink-0">
                                    <Building className="w-8 h-8 text-neutral-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-neutral-900">{job.title}</h3>
                                            <p className="text-primary font-medium">{job.companyName}</p>
                                        </div>
                                        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">{job.type}</span>
                                    </div>

                                    <div className="flex gap-6 mt-4 text-sm text-neutral-500">
                                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                                        <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {job.salary || "Not Disclosed"}</span>
                                        <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.applicants?.length || 0} Applicants</span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {job.skills.map((skill, i) => (
                                            <span key={i} className="bg-neutral-100 text-neutral-600 px-2 py-1 rounded text-xs">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => handleApply(job._id)}
                                        className="w-full md:w-auto bg-neutral-900 hover:bg-black text-white px-6 py-2 rounded-lg font-bold transition-colors"
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            </div>
                        ))}
                        {filteredJobs.length === 0 && <div className="text-center py-12 text-neutral-500">No jobs found matching your criteria.</div>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobBoard;
