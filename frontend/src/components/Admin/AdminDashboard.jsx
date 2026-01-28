import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        company: '',
        linkedin: '',
        pricePerSession: '',
        skills: ''
    });
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetchMentors();
    }, []);

    const fetchMentors = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/mentors`);
            setMentors(res.data);
            setLoading(false);
        } catch (err) {
            toast.error("Failed to fetch mentors");
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) return toast.error("Please upload an image");

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append('image', image);

        try {
            toast.loading("Adding Mentor...");
            await axios.post(`${API_URL}/api/mentors`, data, { withCredentials: true });
            toast.dismiss();
            toast.success("Mentor Added!");
            setFormData({ name: '', role: '', company: '', linkedin: '', pricePerSession: '', skills: '' });
            setImage(null);
            fetchMentors();
        } catch (err) {
            toast.dismiss();
            toast.error("Failed to add mentor");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`${API_URL}/api/mentors/${id}`, { withCredentials: true });
            toast.success("Mentor Deleted");
            fetchMentors();
        } catch (err) {
            toast.error("Failed to delete mentor");
        }
    };

    const handlePlanSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/plans`, planForm, { withCredentials: true });
            toast.success("Plan Added!");
            setPlanForm({ name: '', price: '', duration: 'month', features: '', buttonText: 'Subscribe Now', recommended: false });
            fetchPlans();
        } catch (err) {
            toast.error("Failed to add plan");
        }
    };

    const deletePlan = async (id) => {
        if (!window.confirm("Delete plan?")) return;
        try {
            await axios.delete(`${API_URL}/api/plans/${id}`, { withCredentials: true });
            toast.success("Plan Deleted");
            fetchPlans();
        } catch (err) {
            toast.error("Failed to delete plan");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-neutral-900 mb-8">Admin Dashboard</h1>

                <div className="flex gap-4 mb-8">
                    <button onClick={() => setActiveTab('mentors')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'mentors' ? 'bg-primary text-white' : 'bg-white text-neutral-600'}`}>Manage Mentors</button>
                    <button onClick={() => setActiveTab('plans')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'plans' ? 'bg-primary text-white' : 'bg-white text-neutral-600'}`}>Manage Plans</button>
                </div>

                {activeTab === 'mentors' ? (
                    <>
                        {/* Add Mentor Form */}
                        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus className="w-5 h-5" /> Add New Mentor</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} required className="input-field border p-2 rounded" />
                                    <input name="role" placeholder="Role (e.g. SDE)" value={formData.role} onChange={handleInputChange} required className="input-field border p-2 rounded" />
                                    <input name="company" placeholder="Company" value={formData.company} onChange={handleInputChange} className="input-field border p-2 rounded" />
                                    <input name="pricePerSession" type="number" placeholder="Price/Session" value={formData.pricePerSession} onChange={handleInputChange} className="input-field border p-2 rounded" />
                                    <input name="linkedin" placeholder="LinkedIn URL" value={formData.linkedin} onChange={handleInputChange} className="input-field border p-2 rounded" />
                                    <input name="skills" placeholder="Skills (comma separated)" value={formData.skills} onChange={handleInputChange} className="input-field border p-2 rounded" />
                                </div>

                                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-4 text-center cursor-pointer hover:bg-neutral-50 transition-colors">
                                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="hidden" id="mentor-img" />
                                    <label htmlFor="mentor-img" className="cursor-pointer flex flex-col items-center">
                                        <Upload className="w-6 h-6 text-neutral-400 mb-2" />
                                        <span className="text-sm text-neutral-500">{image ? image.name : "Upload Profile Image"}</span>
                                    </label>
                                </div>

                                <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors">Add Mentor</button>
                            </form>
                        </div>

                        {/* Mentor List */}
                        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                            <h2 className="text-xl font-bold mb-6">Manage Mentors</h2>
                            {loading ? <p>Loading...</p> : (
                                <div className="space-y-4">
                                    {mentors.map(mentor => (
                                        <div key={mentor._id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-4">
                                                <img src={mentor.image} alt={mentor.name} className="w-12 h-12 rounded-full object-cover" />
                                                <div>
                                                    <h3 className="font-bold">{mentor.name}</h3>
                                                    <p className="text-sm text-neutral-500">{mentor.role} @ {mentor.company}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => handleDelete(mentor._id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-5 h-5" /></button>
                                        </div>
                                    ))}
                                    {mentors.length === 0 && <p className="text-center text-neutral-400">No mentors found.</p>}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Add Plan Form */}
                        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8">
                            <h2 className="text-xl font-bold mb-6">Add New Plan</h2>
                            <form onSubmit={handlePlanSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input placeholder="Plan Name (e.g. Premium)" value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} required className="input-field border p-2 rounded" />
                                    <input type="number" placeholder="Price" value={planForm.price} onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })} required className="input-field border p-2 rounded" />
                                    <input placeholder="Duration (month/year)" value={planForm.duration} onChange={(e) => setPlanForm({ ...planForm, duration: e.target.value })} className="input-field border p-2 rounded" />
                                    <input placeholder="Button Text" value={planForm.buttonText} onChange={(e) => setPlanForm({ ...planForm, buttonText: e.target.value })} className="input-field border p-2 rounded" />
                                </div>
                                <textarea placeholder="Features (comma separated)" value={planForm.features} onChange={(e) => setPlanForm({ ...planForm, features: e.target.value })} className="w-full border p-2 rounded h-24" />
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={planForm.recommended} onChange={(e) => setPlanForm({ ...planForm, recommended: e.target.checked })} />
                                    Recommend this plan?
                                </label>
                                <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-bold">Add Plan</button>
                            </form>
                        </div>

                        {/* Plan List */}
                        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
                            <h2 className="text-xl font-bold mb-6">Manage Plans</h2>
                            <div className="space-y-4">
                                {plans.map(plan => (
                                    <div key={plan._id} className="flex justify-between items-center p-4 border rounded-lg">
                                        <div>
                                            <h3 className="font-bold">{plan.name} {plan.recommended && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 rounded">Recommended</span>}</h3>
                                            <p className="text-sm text-neutral-500">₹{plan.price}/{plan.duration}</p>
                                        </div>
                                        <button onClick={() => deletePlan(plan._id)} className="text-red-500"><Trash2 /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;
