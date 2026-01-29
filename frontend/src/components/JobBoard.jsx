import React, { useEffect, useState } from 'react';
import { Briefcase, MapPin, DollarSign, Building, Search, Upload, X, Check } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const JobBoard = ({ user }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedJob, setSelectedJob] = useState(null);
    const [resumeLink, setResumeLink] = useState("");
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

    const handleApplyClick = (job) => {
        if (!user) return toast.error("Login to apply");
        setSelectedJob(job);
    };

    const submitApplication = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/jobs/${selectedJob._id}/apply`, { resume: resumeLink }, { withCredentials: true });
            toast.success("Application Submitted Successfully!");
            setSelectedJob(null);
            setResumeLink("");
            fetchJobs(); // Refresh to update applicant count
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to apply");
        }
    };

    const filteredJobs = jobs.filter(j =>
        (filter === "All" || j.type === filter) &&
        (j.title.toLowerCase().includes(searchTerm.toLowerCase()) || j.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Job & Internship Board</h1>
                        <p className="text-neutral-500">Discover opportunities to kickstart your career.</p>
                    </div>
                    {user && (user.role === 'recruiter' || user.role === 'recuritor') && (
                        <div className="flex gap-4">
                            <button onClick={() => navigate('/recruiter-dashboard')} className="bg-white border border-neutral-300 text-neutral-700 px-6 py-2 rounded-lg font-bold hover:bg-neutral-50 shadow-sm">
                                Manage Applicants
                            </button>
                            <button onClick={() => navigate('/post-job')} className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-transform hover:-translate-y-1">
                                + Post a Job
                            </button>
                        </div>
                    )}
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-200 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search by title or company..."
                            className="w-full pl-10 pr-4 py-3 bg-neutral-50 rounded-lg border-none outline-none focus:ring-2 focus:ring-primary/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
                        {["All", "Internship", "Full-time", "Part-time"].map(type => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-5 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${filter === type ? 'bg-neutral-900 text-white' : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 animate-pulse text-neutral-400">Loading Opportunities...</div>
                ) : (
                    <div className="grid gap-6">
                        {filteredJobs.map(job => (
                            <div key={job._id} className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200 hover:border-indigo-500 transition-all group flex flex-col md:flex-row gap-6 relative overflow-hidden">
                                {job.applicants?.some(a => a.user === user?._id) && (
                                    <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-3 py-1 rounded-bl-xl font-bold flex items-center gap-1">
                                        <Check className="w-3 h-3" /> Applied
                                    </div>
                                )}

                                <div className="w-16 h-16 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl flex items-center justify-center shrink-0">
                                    <Building className="w-8 h-8 text-neutral-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                                            <p className="text-neutral-500 font-medium">{job.companyName}</p>
                                        </div>
                                        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">{job.type}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-sm text-neutral-500 mb-4">
                                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
                                        <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {job.salary || "Competitive"}</span>
                                        <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {job.applicants?.length || 0} Applied</span>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {job.skills.map((skill, i) => (
                                            <span key={i} className="bg-neutral-50 border border-neutral-100 text-neutral-600 px-2 py-1 rounded text-xs font-medium">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => handleApplyClick(job)}
                                        disabled={job.applicants?.some(a => a.user === user?._id)}
                                        className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${job.applicants?.some(a => a.user === user?._id)
                                                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed shadow-none'
                                                : 'bg-neutral-900 hover:bg-black text-white hover:-translate-y-1 shadow-indigo-500/20'
                                            }`}
                                    >
                                        {job.applicants?.some(a => a.user === user?._id) ? 'Applied' : 'Apply Now'}
                                    </button>
                                </div>
                            </div>
                        ))}
                        {filteredJobs.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-neutral-300">
                                <Search className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                                <p className="text-neutral-500 font-medium">No jobs found matching your criteria.</p>
                                <button onClick={() => { setFilter("All"); setSearchTerm(""); }} className="text-indigo-600 font-bold mt-2 hover:underline">Clear Filters</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Application Modal */}
            {selectedJob && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-md p-8 relative shadow-2xl animate-scale-up">
                        <button onClick={() => setSelectedJob(null)} className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full transition-colors"><X className="w-5 h-5 text-neutral-400" /></button>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-neutral-900">Apply to {selectedJob.title}</h2>
                            <p className="text-neutral-500">{selectedJob.companyName}</p>
                        </div>

                        <form onSubmit={submitApplication} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">Resume / Portfolio Link</label>
                                <div className="relative">
                                    <Upload className="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" />
                                    <input
                                        type="url"
                                        required
                                        placeholder="https://drive.google.com/..."
                                        className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                        value={resumeLink}
                                        onChange={(e) => setResumeLink(e.target.value)}
                                    />
                                </div>
                                <p className="text-xs text-neutral-400 mt-2 ml-1">Provide a link to your Resume, LinkedIn, or Portfolio.</p>
                            </div>

                            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-1">
                                Submit Application
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobBoard;
