import React, { useEffect, useState } from 'react';
import { Calendar, MessageSquare, X, Clock, CreditCard } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const Mentorship = ({ user }) => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [bookingDate, setBookingDate] = useState("");

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/mentors`);
                setMentors(res.data);
            } catch (err) {
                console.error("Failed to fetch mentors");
            } finally {
                setLoading(false);
            }
        };
        fetchMentors();
    }, []);

    const handleBookClick = (mentor) => {
        if (!user) return toast.error("Please login to book a session");
        setSelectedMentor(mentor);
    };

    const confirmBooking = async () => {
        if (!bookingDate) return toast.error("Please select a date");

        try {
            const price = selectedMentor.pricePerSession || 500;

            // Call Booking API
            await axios.post(`${API_URL}/api/bookings`, {
                mentorId: selectedMentor._id,
                date: bookingDate,
                amount: price,
                paymentId: "pay_" + Math.random().toString(36).substring(7) // Mock payment for now
            }, { withCredentials: true });

            toast.success("Session Booked Successfully!");
            setSelectedMentor(null);
        } catch (err) {
            toast.error("Booking Failed");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12 px-4 relative transition-colors duration-300">
            <div className="max-w-screen-xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white mb-4 tracking-tight">Master Your Craft with Top Mentors</h1>
                    <p className="text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
                        Book 1:1 sessions, get code reviews, and career guidance from industry experts.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-neutral-400">Loading Mentors...</div>
                ) : mentors.length === 0 ? (
                    <div className="text-center py-20 text-neutral-500">No mentors available yet. Be the first to join!</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mentors.map(mentor => (
                            <div key={mentor._id} className="glass dark:bg-neutral-800/50 rounded-2xl p-6 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300 border border-neutral-100 dark:border-neutral-700">
                                <div className="relative mb-4">
                                    <img
                                        src={mentor.profilePicture || `https://ui-avatars.com/api/?name=${mentor.fullName}`}
                                        alt={mentor.fullName}
                                        className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-neutral-700 shadow-lg"
                                    />
                                    <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white dark:border-neutral-800" title="Available"></div>
                                </div>

                                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">{mentor.fullName}</h3>
                                <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-1">
                                    {mentor.designation || "Software Engineer"} {mentor.companyName ? `@ ${mentor.companyName}` : ''}
                                </p>
                                <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-4 font-semibold">₹{mentor.pricePerSession || 500} / session</p>

                                <div className="flex flex-wrap gap-2 justify-center mb-6">
                                    {mentor.skills && mentor.skills.slice(0, 4).map((skill, i) => (
                                        <span key={i} className="bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-xs px-2 py-1 rounded-md font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-3 w-full mt-auto">
                                    <button
                                        onClick={() => window.location.href = `/chat?userId=${mentor._id}`}
                                        className="flex items-center justify-center gap-2 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 py-2.5 rounded-xl text-sm font-bold transition-colors"
                                    >
                                        <MessageSquare className="w-4 h-4" /> Chat
                                    </button>
                                    <button
                                        onClick={() => handleBookClick(mentor)}
                                        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-indigo-500/30"
                                    >
                                        <Calendar className="w-4 h-4" /> Book
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            {selectedMentor && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-neutral-800 rounded-3xl w-full max-w-md p-8 relative shadow-2xl border border-neutral-100 dark:border-neutral-700 animate-slide-up">
                        <button onClick={() => setSelectedMentor(null)} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-white transition-colors bg-neutral-100 dark:bg-neutral-700 rounded-full p-1"><X className="w-5 h-5" /></button>

                        <h2 className="text-2xl font-bold mb-1 text-neutral-900 dark:text-white">Book Session</h2>
                        <p className="text-neutral-500 dark:text-neutral-400 mb-6 text-sm">Schedule a 1:1 with {selectedMentor.fullName}</p>

                        <div className="flex items-center gap-4 mb-8 bg-neutral-50 dark:bg-neutral-700/50 p-4 rounded-2xl">
                            <img src={selectedMentor.profilePicture || `https://ui-avatars.com/api/?name=${selectedMentor.fullName}`} className="w-14 h-14 rounded-full object-cover" />
                            <div>
                                <p className="font-bold text-neutral-900 dark:text-white text-lg">{selectedMentor.fullName}</p>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">{selectedMentor.designation || "Mentor"}</p>
                            </div>
                        </div>

                        <div className="space-y-6 mb-8">
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Select Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        className="w-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                    />
                                    <Clock className="absolute right-3 top-3.5 text-neutral-400 w-5 h-5 pointer-events-none" />
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-4 border-t border-dashed border-neutral-200 dark:border-neutral-700">
                                <span className="font-medium text-neutral-600 dark:text-neutral-400">Total Price</span>
                                <span className="font-bold text-2xl text-indigo-600 dark:text-indigo-400">₹{selectedMentor.pricePerSession || 500}</span>
                            </div>
                        </div>

                        <button
                            onClick={confirmBooking}
                            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20 transform hover:-translate-y-1"
                        >
                            <CreditCard className="w-5 h-5" /> Confirm Payment
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Mentorship;
