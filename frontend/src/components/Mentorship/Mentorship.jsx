import React from 'react';
import { Calendar, MessageSquare, Briefcase } from 'lucide-react';

const Mentors = [
    { id: 1, name: "Sanket Singh", role: "SDE @ Google", skills: ["System Design", "Backend", "Career"], image: "https://placehold.co/100" },
    { id: 2, name: "Tanay Pratap", role: "Founder @ Invact", skills: ["Frontend", "React", "Startup"], image: "https://placehold.co/100" },
    { id: 3, name: "Akshay Saini", role: "SDE II @ Uber", skills: ["JavaScript", "Interview Prep"], image: "https://placehold.co/100" },
    { id: 4, name: "Love Babbar", role: "Ex-Amazon", skills: ["DSA", "C++", "Placement"], image: "https://placehold.co/100" },
    { id: 5, name: "Striver", role: "SDE @ Media.net", skills: ["CP", "Algorithms"], image: "https://placehold.co/100" },
    { id: 6, name: "Harkirat Singh", role: "Cohort Lead", skills: ["Full Stack", "Web3", "Open Source"], image: "https://placehold.co/100" },
];

const Mentorship = () => {
    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4">
            <div className="max-w-screen-xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-neutral-900 mb-4">Master Your Craft with Top Mentors</h1>
                    <p className="text-xl text-neutral-500">Book 1:1 sessions, get code reviews, and career guidance.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Mentors.map(mentor => (
                        <div key={mentor.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-center text-center border border-neutral-100">
                            <img src={mentor.image} alt={mentor.name} className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-indigo-50" />
                            <h3 className="text-xl font-bold text-neutral-900">{mentor.name}</h3>
                            <p className="text-primary font-medium mb-4">{mentor.role}</p>

                            <div className="flex flex-wrap gap-2 justify-center mb-6">
                                {mentor.skills.map(skill => (
                                    <span key={skill} className="bg-neutral-100 text-neutral-600 text-xs px-2 py-1 rounded-md">{skill}</span>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-3 w-full mt-auto">
                                <button className="flex items-center justify-center gap-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 py-2 rounded-lg text-sm font-semibold transition-colors">
                                    <MessageSquare className="w-4 h-4" /> Chat
                                </button>
                                <button className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-2 rounded-lg text-sm font-semibold transition-colors">
                                    <Calendar className="w-4 h-4" /> Book
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Mentorship;
