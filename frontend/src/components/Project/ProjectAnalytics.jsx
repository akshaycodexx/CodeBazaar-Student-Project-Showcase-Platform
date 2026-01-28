import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Eye, MousePointer, Star } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const ProjectAnalytics = ({ project }) => {
    if (!project || !project.analytics) return null;

    const stats = [
        { name: 'Views', count: project.analytics.views || 0, icon: <Eye className="w-6 h-6 text-blue-500" /> },
        { name: 'Demo Clicks', count: project.analytics.clicks || 0, icon: <MousePointer className="w-6 h-6 text-green-500" /> },
        { name: 'Stars', count: project.stars || 0, icon: <Star className="w-6 h-6 text-yellow-500" /> },
    ];

    const data = [
        { name: 'Views', value: project.analytics.views || 0 },
        { name: 'Clicks', value: project.analytics.clicks || 0 },
        { name: 'Stars', value: project.stars || 0 },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8 animate-fade-in">
            <h3 className="text-xl font-bold text-neutral-900 mb-6">Project Analytics</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-neutral-50 border border-neutral-100">
                        <div className="p-3 bg-white rounded-full shadow-sm">
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500 font-medium">{stat.name}</p>
                            <p className="text-2xl font-bold text-neutral-900">{stat.count}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: '#f3f4f6' }}
                        />
                        <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={50} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ProjectAnalytics;
