import React from 'react';
import { Search, Download, Briefcase, MapPin } from 'lucide-react';

const Candidates = [
    { id: 1, name: "Rahul Kumar", role: "Frontend Developer", college: "IIT Delhi", skills: ["React", "Tailwind", "Redux"], match: "95%" },
    { id: 2, name: "Priya Sharma", role: "Backend Developer", college: "NIT Trichy", skills: ["Node.js", "MongoDB", "AWS"], match: "88%" },
    { id: 3, name: "Amit Patel", role: "Full Stack Dev", college: "BITS Pilani", skills: ["MERN", "Docker", "Typescript"], match: "92%" },
    { id: 4, name: "Sneha Gupta", role: "UI/UX Designer", college: "NID Ahmedabad", skills: ["Figma", "Adobe XD", "Prototyping"], match: "85%" },
];

const RecruitersPanel = () => {
    return (
        <div className="min-h-screen bg-neutral-50 py-8 px-4">
            <div className="max-w-screen-xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900">Recruiter Dashboard</h1>
                        <p className="text-neutral-500">Find the best talent for your company.</p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-3 text-neutral-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by skill, college, or role..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-50 border-b border-neutral-200">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-neutral-700">Candidate</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-neutral-700">Role & College</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-neutral-700">Top Skills</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-neutral-700">Match Score</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-neutral-700">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {Candidates.map(candidate => (
                                    <tr key={candidate.id} className="hover:bg-neutral-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-primary font-bold">
                                                    {candidate.name.charAt(0)}
                                                </div>
                                                <span className="font-medium text-neutral-900">{candidate.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-neutral-800">{candidate.role}</span>
                                                <span className="text-xs text-neutral-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {candidate.college}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {candidate.skills.slice(0, 2).map((skill, i) => (
                                                    <span key={i} className="bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded text-xs border border-neutral-200">{skill}</span>
                                                ))}
                                                {candidate.skills.length > 2 && <span className="text-xs text-neutral-400">+{candidate.skills.length - 2}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-sm font-bold">{candidate.match}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-primary hover:text-primary-dark font-medium text-sm flex items-center gap-1">
                                                <Download className="w-4 h-4" /> Resume
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruitersPanel;
