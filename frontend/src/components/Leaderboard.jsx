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

    const getRankIcon = (index) => {
        if (index === 0) return <Trophy className="w-8 h-8 text-yellow-500" />;
        if (index === 1) return <Medal className="w-8 h-8 text-gray-400" />;
        if (index === 2) return <Medal className="w-8 h-8 text-amber-600" />;
        return <span className="text-xl font-bold text-neutral-400">#{index + 1}</span>;
    };

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-neutral-900 mb-4 flex items-center justify-center gap-3">
                        <Trophy className="w-10 h-10 text-yellow-500" /> Leaderboard
                    </h1>
                    <p className="text-xl text-neutral-500">Top developers making an impact on CodeBazaar.</p>
                </div>

                {loading ? (
                    <div className="text-center py-20">Loading Top Developers...</div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
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
                                    {users.map((user, index) => (
                                        <tr key={user._id} onClick={() => navigate(`/profile/${user._id}`)} className="hover:bg-indigo-50/30 transition-colors cursor-pointer group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center w-8">
                                                    {getRankIcon(index)}
                                                </div>
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
                                                <div className="inline-flex items-center gap-1 font-bold text-neutral-900 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    {user.points || 0}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
