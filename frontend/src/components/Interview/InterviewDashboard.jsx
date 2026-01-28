import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Code, Clock, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const InterviewDashboard = ({ user }) => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
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
        fetchInterviews();
    }, []);

    const scheduleMock = async () => {
        // Quick Schedule for Demo
        try {
            await axios.post(`${API_URL}/api/interviews/schedule`, {
                mentorId: user._id, // Self-schedule for testing, ideally select another user
                date: new Date(Date.now() + 86400000), // Tomorrow
                topic: "DSA"
            }, { withCredentials: true });
            window.location.reload();
        } catch (e) { alert("Failed to schedule"); }
    };

    if (loading) return <div className="text-center py-20">Loading Interviews...</div>;

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900">Mock Interviews</h1>
                        <p className="text-neutral-500">Practice with peers and mentors.</p>
                    </div>
                    <button onClick={scheduleMock} className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-transform hover:-translate-y-1">
                        + Quick Schedule (Demo)
                    </button>
                </div>

                <div className="grid gap-6">
                    {interviews.map(interview => (
                        <div key={interview._id} className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-primary font-bold">
                                    <Code className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900">{interview.topic} Mock Interview</h3>
                                    <div className="flex gap-4 text-sm text-neutral-500 mt-1">
                                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(interview.date).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(interview.date).toLocaleTimeString()}</span>
                                    </div>
                                    <p className="text-sm mt-1">With: <span className="font-semibold">{interview.mentor?._id === user._id ? interview.student?.fullName : interview.mentor?.fullName}</span></p>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate(`/interviews/${interview._id}/room`)}
                                className="bg-neutral-900 hover:bg-black text-white px-6 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
                            >
                                <Video className="w-4 h-4" /> Join Room
                            </button>
                        </div>
                    ))}
                    {interviews.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl border border-neutral-200 border-dashed">
                            <p className="text-neutral-500 mb-4">No scheduled interviews.</p>
                            <button onClick={scheduleMock} className="text-primary font-bold hover:underline">Schedule one now</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InterviewDashboard;
