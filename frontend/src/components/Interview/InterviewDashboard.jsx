import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Code, Clock, Video, Plus, X, Laptop } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const InterviewDashboard = ({ user }) => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [scheduleForm, setScheduleForm] = useState({ topic: 'DSA', date: '' });

    const navigate = useNavigate();

    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/interviews/my-interviews`, { withCredentials: true });
            setInterviews(res.data);
        } catch (err) {
            console.error("Failed to fetch interviews");
        } finally {
            setLoading(false);
        }
    };

    const handleSchedule = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/interviews/schedule`, {
                // If we had peer matching, we'd send no mentorId and backend handles it.
                // For now, defaulting to Solo Practice (user = mentor)
                mentorId: user._id,
                date: scheduleForm.date || new Date(),
                topic: scheduleForm.topic
            }, { withCredentials: true });

            toast.success("Interview Scheduled!");
            setShowModal(false);
            fetchInterviews();
        } catch (err) {
            toast.error("Failed to schedule");
        }
    };

    const startInstantValues = async (topic) => {
        try {
            const res = await axios.post(`${API_URL}/api/interviews/schedule`, {
                mentorId: user._id,
                date: new Date(),
                topic: topic
            }, { withCredentials: true });
            toast.success("Starting Session...");
            navigate(`/interviews/${res.data._id}/room`);
        } catch (err) {
            toast.error("Failed to start");
        }
    }

    if (loading) return <div className="text-center py-20 text-neutral-500">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black py-12 px-4 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-white mb-2 tracking-tight">Mock Interview Center</h1>
                        <p className="text-xl text-neutral-500 dark:text-neutral-400">Master your technical skills with realistic coding interviews.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-neutral-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                        >
                            <Calendar className="w-5 h-5" /> Schedule for Later
                        </button>
                    </div>
                </div>

                {/* Quick Start Cards */}
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Quick Start Practice</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {['DSA', 'Frontend', 'System Design'].map(topic => (
                        <div key={topic} className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all cursor-pointer group" onClick={() => startInstantValues(topic)}>
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Laptop className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">{topic} Mock</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">Launch an instant {topic} practice session.</p>
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                                Start Now <Plus className="w-4 h-4" />
                            </span>
                        </div>
                    ))}
                </div>

                {/* Upcoming Interviews */}
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Your Schedule</h2>
                <div className="grid gap-4">
                    {interviews.filter(i => i.status !== 'Completed').map(interview => (
                        <div key={interview._id} className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-neutral-600 dark:text-neutral-300 font-bold">
                                    <Code className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{interview.topic} Interview</h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                                        <span className="flex items-center gap-1 bg-neutral-50 dark:bg-neutral-800 px-2 py-1 rounded"><Calendar className="w-4 h-4" /> {new Date(interview.date).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1 bg-neutral-50 dark:bg-neutral-800 px-2 py-1 rounded"><Clock className="w-4 h-4" /> {new Date(interview.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate(`/interviews/${interview._id}/room`)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 w-full md:w-auto flex items-center justify-center gap-2"
                            >
                                <Video className="w-5 h-5" /> Join Room
                            </button>
                        </div>
                    ))}
                    {interviews.filter(i => i.status !== 'Completed').length === 0 && (
                        <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700">
                            <p className="text-neutral-500 dark:text-neutral-400 mb-2">No upcoming interviews scheduled.</p>
                            <button onClick={() => setShowModal(true)} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Schedule one now</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Schedule Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white dark:bg-neutral-800 rounded-3xl w-full max-w-md p-8 relative shadow-2xl animate-scale-up">
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-white bg-neutral-100 dark:bg-neutral-700 rounded-full p-2 transition-colors"><X className="w-5 h-5" /></button>

                        <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">Schedule Mock Interview</h2>
                        <form onSubmit={handleSchedule} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Topic</label>
                                <select
                                    className="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    value={scheduleForm.topic}
                                    onChange={(e) => setScheduleForm({ ...scheduleForm, topic: e.target.value })}
                                >
                                    <option value="DSA">Data Structures & Algo</option>
                                    <option value="Frontend">Frontend Development</option>
                                    <option value="Backend">Backend Development</option>
                                    <option value="System Design">System Design</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    className="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
                                    value={scheduleForm.date}
                                    onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                                    min={new Date().toISOString().slice(0, 16)}
                                />
                            </div>

                            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 transform hover:-translate-y-1">
                                Confirm Schedule
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterviewDashboard;
