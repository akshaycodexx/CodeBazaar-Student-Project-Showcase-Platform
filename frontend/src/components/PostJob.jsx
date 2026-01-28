import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const PostJob = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'Internship',
        location: '',
        salary: '',
        skills: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/jobs`, {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim())
            }, { withCredentials: true });

            toast.success("Job Posted Successfully!");
            navigate('/jobs');
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to post job");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-neutral-100">
                <h2 className="text-2xl font-bold mb-6 text-neutral-900">Post a Job</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Job Title</label>
                        <input name="title" required onChange={handleChange} className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. React Developer Intern" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Type</label>
                        <select name="type" onChange={handleChange} className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                            <option value="Internship">Internship</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Location</label>
                        <input name="location" required onChange={handleChange} className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Remote, Bangalore" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Salary / Stipend</label>
                        <input name="salary" onChange={handleChange} className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. 15k/month" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Skills (comma separated)</label>
                        <input name="skills" onChange={handleChange} className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="React, Node.js, MongoDB" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                        <textarea name="description" required onChange={handleChange} rows="4" className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="Job details..." />
                    </div>

                    <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-colors shadow-lg mt-2">
                        Post Job
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostJob;
