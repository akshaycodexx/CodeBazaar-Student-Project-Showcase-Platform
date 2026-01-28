import React from 'react';
import { Briefcase, Users, FileText, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecruiterDashboard = ({ user }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4">
            <div className="max-w-screen-xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900">Recruiter Dashboard</h1>
                        <p className="text-neutral-500">Welcome back, {user.fullName}</p>
                    </div>
                    <button
                        onClick={() => navigate('/recruiters')}
                        className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors"
                    >
                        <Search className="w-5 h-5" /> Find Talent
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Briefcase /></div>
                            <h3 className="font-bold text-neutral-900">Jobs Posted</h3>
                        </div>
                        <p className="text-3xl font-bold">0</p>
                        <p className="text-xs text-neutral-400 mt-1">Active job listings</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-green-50 text-green-600 rounded-lg"><Users /></div>
                            <h3 className="font-bold text-neutral-900">Candidates Viewed</h3>
                        </div>
                        <p className="text-3xl font-bold">0</p>
                        <p className="text-xs text-neutral-400 mt-1">Profiles visited</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><FileText /></div>
                            <h3 className="font-bold text-neutral-900">Shortlisted</h3>
                        </div>
                        <p className="text-3xl font-bold">0</p>
                        <p className="text-xs text-neutral-400 mt-1">Saved candidates</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 text-center">
                    <h2 className="text-xl font-bold mb-4">Start Hiring Top Talent</h2>
                    <p className="text-neutral-500 mb-6">Browse through thousands of student projects and portfolios.</p>
                    <button onClick={() => navigate('/recruiters')} className="text-primary font-bold hover:underline">Go to Recruiters Panel &rarr;</button>
                </div>
            </div>
        </div>
    );
};

export default RecruiterDashboard;
