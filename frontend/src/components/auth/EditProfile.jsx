import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const EditProfile = ({ user, setuser }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        mobile: "",
        collegeName: "",
        branch: "",
        github: "",
        linkedin: "",
        companyName: "",
        designation: "",
        companyWebsite: "",
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || "",
                mobile: user.mobile || "",
                collegeName: user.collegeName || "",
                branch: user.branch || "",
                github: user.github || "",
                linkedin: user.linkedin || "",
                companyName: user.companyName || "",
                designation: user.designation || "",
                companyWebsite: user.companyWebsite || "",
            });
            setPreview(user.profilePicture);
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });
        if (profilePicture) {
            data.append("profilePicture", profilePicture);
        }

        try {
            const res = await axios.put(`${API_URL}/api/update-profile`, data, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            setuser(res.data.user); // Update global user state
            toast.success("Profile updated successfully!");
            navigate("/"); // Redirect to home or dashboard
        } catch (error) {
            console.error("Update Error:", error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="text-center p-10">Please log in to edit profile.</div>;

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4 flex justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200 w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6 border-b pb-4">Edit Profile</h2>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Profile Picture */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary">
                            <img src={preview || "/default-avatar.png"} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <label className="cursor-pointer bg-neutral-100 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors text-sm font-medium">
                            Change Picture
                            <input type="file" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:ring-primary focus:border-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Mobile</label>
                            <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:ring-primary focus:border-primary outline-none" />
                        </div>
                    </div>

                    {/* Student Fields */}
                    {user.role === 'student' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">College</label>
                                    <input type="text" name="collegeName" value={formData.collegeName} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:ring-primary focus:border-primary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Branch</label>
                                    <input type="text" name="branch" value={formData.branch} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:ring-primary focus:border-primary outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">GitHub</label>
                                    <input type="url" name="github" value={formData.github} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:ring-primary focus:border-primary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">LinkedIn</label>
                                    <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:ring-primary focus:border-primary outline-none" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recruiter Fields */}
                    {user.role === 'recuritor' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Company Name</label>
                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:ring-primary focus:border-primary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Designation</label>
                                    <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:ring-primary focus:border-primary outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Company Website</label>
                                <input type="url" name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} className="w-full p-2.5 border rounded-lg focus:ring-primary focus:border-primary outline-none" />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors shadow-md disabled:opacity-50"
                    >
                        {loading ? "Updating..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
