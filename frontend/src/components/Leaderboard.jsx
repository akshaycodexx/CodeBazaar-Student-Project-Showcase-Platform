import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Award, Star } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/leaderboard`);
                setUsers(res.data);
            } catch (err) {
                console.error("Failed to fetch leaderboard");
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    const topThree = users.slice(0, 3);
    const restUsers = users.slice(3);

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12 animate-fade-in-up">
                    <h1 className="text-4xl font-extrabold text-neutral-900 mb-4 flex items-center justify-center gap-3">
                        <Trophy className="w-10 h-10 text-yellow-500" /> Leaderboard
                    </h1>
                    <p className="text-xl text-neutral-500">Top developers making an impact on CodeBazaar.</p>
                </div>

                {loading ? (
                    <div className="text-center py-20 animate-pulse text-neutral-400">Calculatiing Rankings...</div>
                ) : (
                    <>
                        {/* Podium */}
                        <div className="flex flex-col md:flex-row justify-center items-end gap-6 mb-12 animate-scale-up">
                            {/* 2nd Place */}
                            {topThree[1] && (
                                <div onClick={() => navigate(`/profile/${topThree[1]._id}`)} className="bg-white p-6 rounded-2xl shadow-lg border border-neutral-200 flex flex-col items-center w-full md:w-64 order-2 md:order-1 cursor-pointer hover:-translate-y-2 transition-transform">
                                    <div className="relative mb-4">
                                        <div className="w-20 h-20 rounded-full border-4 border-gray-300 overflow-hidden">
                                            <img src={topThree[1].profilePicture || "/default-avatar.png"} alt={topThree[1].fullName} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-300 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow">2</div>
                                    </div>
                                    <h3 className="font-bold text-lg text-neutral-900">{topThree[1].fullName}</h3>
                                    <p className="text-sm text-neutral-500 mb-2">Knight</p>
                                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold text-sm">{topThree[1].points} pts</span>
                                </div>
                            )}

                            {/* 1st Place */}
                            {topThree[0] && (
                                <div onClick={() => navigate(`/profile/${topThree[0]._id}`)} className="bg-white p-8 rounded-2xl shadow-xl border-2 border-yellow-400 flex flex-col items-center w-full md:w-72 order-1 md:order-2 z-10 cursor-pointer hover:-translate-y-2 transition-transform relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-300 to-yellow-500"></div>
                                    <div className="relative mb-4">
                                        <div className="w-24 h-24 rounded-full border-4 border-yellow-400 overflow-hidden">
                                            <img src={topThree[0].profilePicture || "/default-avatar.png"} alt={topThree[0].fullName} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shadow-lg">1</div>
                                    </div>
                                    <h3 className="font-bold text-xl text-neutral-900 mt-2">{topThree[0].fullName}</h3>
                                    <p className="text-sm text-neutral-500 mb-3">Legend</p>
                                    <span className="bg-yellow-50 text-yellow-700 px-4 py-1.5 rounded-full font-bold text-lg border border-yellow-200">{topThree[0].points} pts</span>
                                </div>
                            )}

                            {/* 3rd Place */}
                            {topThree[2] && (
                                <div onClick={() => navigate(`/profile/${topThree[2]._id}`)} className="bg-white p-6 rounded-2xl shadow-lg border border-neutral-200 flex flex-col items-center w-full md:w-64 order-3 cursor-pointer hover:-translate-y-2 transition-transform">
                                    <div className="relative mb-4">
                                        <div className="w-20 h-20 rounded-full border-4 border-amber-600 overflow-hidden">
                                            <img src={topThree[2].profilePicture || "/default-avatar.png"} alt={topThree[2].fullName} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow">3</div>
                                    </div>
                                    <h3 className="font-bold text-lg text-neutral-900">{topThree[2].fullName}</h3>
                                    <p className="text-sm text-neutral-500 mb-2">Squire</p>
                                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold text-sm">{topThree[2].points} pts</span>
                                </div>
                            )}
                        </div>

                        {/* List */}
                        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden animate-fade-in-up delay-100">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-neutral-50 border-b border-neutral-200">
                                        <tr>
                                            <th className="px-6 py-4 font-bold text-neutral-600">Rank</th>
                                            <th className="px-6 py-4 font-bold text-neutral-600">Developer</th>
                                            <th className="px-6 py-4 font-bold text-neutral-600">Badges</th>
                                            <th className="px-6 py-4 font-bold text-neutral-600 text-right">Points</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100">
                                        {restUsers.map((user, index) => (
                                            <tr key={user._id} onClick={() => navigate(`/profile/${user._id}`)} className="hover:bg-indigo-50/30 transition-colors cursor-pointer group">
                                                <td className="px-6 py-4 text-neutral-500 font-bold w-16">
                                                    #{index + 4}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={user.profilePicture || "/default-avatar.png"} alt={user.fullName} className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-primary transition-colors" />
                                                        <div>
                                                            <p className="font-bold text-neutral-900">{user.fullName}</p>
                                                            <p className="text-xs text-neutral-500">{user.role}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-1">
                                                        {user.badges && user.badges.length > 0 ? (
                                                            user.badges.map((badge, i) => (
                                                                <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                                                                    {badge}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-neutral-400 text-sm">-</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="inline-flex items-center gap-1 font-bold text-neutral-900 bg-neutral-50 px-3 py-1 rounded-full border border-neutral-200">
                                                        {user.points || 0} pts
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
