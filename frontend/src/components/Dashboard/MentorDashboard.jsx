import React from 'react';
import { Calendar, DollarSign, MessageSquare, Clock } from 'lucide-react';

const MentorDashboard = ({ user }) => {
    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4">
            <div className="max-w-screen-xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900">Mentor Dashboard</h1>
                    <p className="text-neutral-500">Manage your sessions and earnings, {user.fullName}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-indigo-50 text-primary rounded-lg"><Calendar /></div>
                            <h3 className="font-bold text-neutral-900">Sessions</h3>
                        </div>
                        <p className="text-3xl font-bold">0</p>
                        <p className="text-xs text-neutral-400 mt-1">Upcoming bookings</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-green-50 text-green-600 rounded-lg"><DollarSign /></div>
                            <h3 className="font-bold text-neutral-900">Earnings</h3>
                        </div>
                        <p className="text-3xl font-bold">₹0</p>
                        <p className="text-xs text-neutral-400 mt-1">Total revenue</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Clock /></div>
                            <h3 className="font-bold text-neutral-900">Hours</h3>
                        </div>
                        <p className="text-3xl font-bold">0h</p>
                        <p className="text-xs text-neutral-400 mt-1">Mentored time</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg"><MessageSquare /></div>
                            <h3 className="font-bold text-neutral-900">Reviews</h3>
                        </div>
                        <p className="text-3xl font-bold">0</p>
                        <p className="text-xs text-neutral-400 mt-1">Student feedbacks</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
                    <h2 className="text-xl font-bold mb-4">Upcoming Sessions</h2>
                    <p className="text-neutral-500">No sessions scheduled yet.</p>
                </div>
            </div>
        </div>
    );
};

export default MentorDashboard;
