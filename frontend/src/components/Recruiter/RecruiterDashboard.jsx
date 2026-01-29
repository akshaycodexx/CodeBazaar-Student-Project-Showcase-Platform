import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, FileText, ChevronRight, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const RecruiterDashboard = ({ user }) => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const fetchMyJobs = async () => {
        try {
            // Reusing get jobs API but filtering or using a specific 'my-jobs' endpoint if available.
            // Since controller for 'getAllJobs' returns all, we might need to filter client side or add 'my-jobs' endpoint.
            // Let's filter client side for MVP or better, add my-jobs endpoint.
            // Actually, for security, 'my-jobs' is better. But to save steps, I will use getAllJobs and filter by user.id
            const res = await axios.get(`${API_URL}/api/jobs`);
            const myJobs = res.data.filter(j => j.recruiter && j.recruiter._id === user._id);
            setJobs(myJobs);
        } catch (err) {
            console.error("Failed to fetch jobs");
        } finally {
            setLoading(false);
        }
    };

    const handleViewApplicants = async (job) => {
        setSelectedJob(job);
        try {
            const res = await axios.get(`${API_URL}/api/jobs/${job._id}/applicants`, { withCredentials: true });
            setApplicants(res.data);
        } catch (err) {
            toast.error("Failed to fetch applicants");
        }
    };

    const updateStatus = async (userId, newStatus) => {
        try {
            const res = await axios.put(`${API_URL}/api/jobs/${selectedJob._id}/status`, { userId, status: newStatus }, { withCredentials: true });
            setApplicants(prev => prev.map(app => app.user._id === userId ? { ...app, status: newStatus } : app));
            toast.success(`Status updated to ${newStatus}`);
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    if (loading) return <div className="p-12 text-center text-neutral-500">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-neutral-900">Recruiter Dashboard</h1>
                    <p className="text-neutral-500">Manage your job postings and applicants.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Jobs List */}
                    <div className="lg:col-span-1 space-y-4">
                        <h2 className="font-bold text-lg text-neutral-800 mb-4">Your Jobs</h2>
                        {jobs.map(job => (
                            <div
                                key={job._id}
                                onClick={() => handleViewApplicants(job)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedJob?._id === job._id ? 'bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500' : 'bg-white border-neutral-200 hover:border-indigo-300'}`}
                            >
                                <h3 className="font-bold text-neutral-900">{job.title}</h3>
                                <div className="flex justify-between items-center mt-2 text-sm">
                                    <span className="text-neutral-500">{new Date(job.createdAt).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1 bg-neutral-100 px-2 py-1 rounded text-neutral-600 font-medium">
                                        <Users className="w-3 h-3" /> {job.applicants?.length}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {jobs.length === 0 && <p className="text-neutral-400 italic">No jobs posted yet.</p>}
                    </div>

                    {/* Applicants Panel */}
                    <div className="lg:col-span-2">
                        {selectedJob ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 animate-fade-in">
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-100">
                                    <h2 className="text-xl font-bold text-neutral-900">Applicants for {selectedJob.title}</h2>
                                    <span className="text-sm bg-neutral-100 px-3 py-1 rounded-full font-medium text-neutral-600">{applicants.length} Candidates</span>
                                </div>

                                <div className="space-y-4">
                                    {applicants.map(app => (
                                        <div key={app.user._id} className="flex flex-col md:flex-row gap-4 p-4 border border-neutral-100 rounded-xl hover:bg-neutral-50 transition-colors">
                                            <img src={app.user.profilePicture || "/default-avatar.png"} alt={app.user.fullName} className="w-12 h-12 rounded-full object-cover" />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-bold text-neutral-900">{app.user.fullName}</h3>
                                                        <p className="text-sm text-neutral-500">{app.user.headline || app.user.email}</p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${app.status === 'Hired' ? 'bg-green-100 text-green-700' :
                                                            app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                                'bg-blue-50 text-blue-700'
                                                        }`}>
                                                        {app.status}
                                                    </span>
                                                </div>

                                                <div className="flex gap-4 mt-3 text-sm">
                                                    {app.resume && (
                                                        <a href={app.resume} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-indigo-600 hover:underline font-medium">
                                                            <FileText className="w-4 h-4" /> View Resume
                                                        </a>
                                                    )}
                                                    <span className="text-neutral-400">• Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => updateStatus(app.user._id, 'Interview')} title="Interview" className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Clock className="w-5 h-5" /></button>
                                                <button onClick={() => updateStatus(app.user._id, 'Hired')} title="Hire" className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"><CheckCircle className="w-5 h-5" /></button>
                                                <button onClick={() => updateStatus(app.user._id, 'Rejected')} title="Reject" className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><XCircle className="w-5 h-5" /></button>
                                            </div>
                                        </div>
                                    ))}
                                    {applicants.length === 0 && <p className="text-neutral-400 text-center py-8">No applicants yet.</p>}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-neutral-300">
                                <p className="text-neutral-400 font-medium">Select a job to view applicants</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterDashboard;
