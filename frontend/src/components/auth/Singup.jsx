import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [isLoading, setIsLoading] = useState(false);

  const [formdata, setFormdata] = useState({
    fullName: "",
    email: "",
    mobile: "",
    username: "",
    password: "",
    collegeName: "",
    branch: "",
    github: "",
    linkedin: "",
    companyName: "",
    designation: "",
    companyWebsite: "",
    recruiterLinkedin: "",
    adminDept: "",
    adminCode: "",
    // Mentor
    pricePerSession: "",
    skills: "",
    role: "student", // field to store role if backend expects it in body not just separate state
  });

  const [profilePicture, setProfilePicture] = useState(null);

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleProfilePicChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    for (const key in formdata) {
      if (formdata[key]) {
        data.append(key, formdata[key]);
      }
    }

    if (profilePicture) {
      data.append("profilePicture", profilePicture);
    }

    data.append("role", role);

    try {
      await axios.post(`${API_URL}/api/signup`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true
      });

      alert("Signup Successful!");
      navigate("/signin");
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      alert("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white py-12 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-neutral-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900">Create Account</h2>
          <p className="text-neutral-500 mt-2">Join CodeBazaar today</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">

          <div className="flex flex-col items-center mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-2">Profile Picture</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-neutral-300 border-dashed rounded-full cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition-colors">
                {profilePicture ? (
                  <img src={URL.createObjectURL(profilePicture)} alt="Preview" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <span className="text-xs text-neutral-500">Upload</span>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" name="profilePicture" onChange={handleProfilePicChange} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="fullName" placeholder="Full Name" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary outline-none" />
            <input type="email" name="email" placeholder="Email Address" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary outline-none" />
            <input type="text" name="mobile" placeholder="Mobile Number" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary outline-none" />
            <input type="text" name="username" placeholder="Username" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary outline-none" />
          </div>

          <input type="password" name="password" placeholder="Password" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary outline-none" />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">I am a...</label>
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary outline-none bg-white"
            >
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
              <option value="mentor">Mentor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {role === "student" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <input type="text" name="collegeName" placeholder="College Name" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary outline-none" />
              <input type="text" name="branch" placeholder="Branch" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary outline-none" />
              <input type="url" name="github" placeholder="GitHub Profile URL" onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary outline-none" />
              <input type="url" name="linkedin" placeholder="LinkedIn Profile URL" onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary outline-none" />
            </div>
          )}

          {role === "recruiter" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <input type="text" name="companyName" placeholder="Company Name" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary outline-none" />
              <input type="text" name="designation" placeholder="Designation" onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary outline-none" />
              <input type="url" name="companyWebsite" placeholder="Company Website" onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary outline-none" />
              <input type="url" name="recruiterLinkedin" placeholder="LinkedIn Profile URL" onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary outline-none" />
            </div>
          )}

          {role === "mentor" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <input type="text" name="companyName" placeholder="Current Company / Organization" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary outline-none" />
              <input type="text" name="designation" placeholder="Role (e.g. Senior SDE)" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary outline-none" />
              <input type="number" name="pricePerSession" placeholder="Price Per Session (₹)" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary outline-none" />
              <input type="text" name="skills" placeholder="Skills (comma separated)" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary outline-none" />
              <input type="url" name="linkedin" placeholder="LinkedIn Profile URL" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary outline-none" />
            </div>
          )}

          {role === "admin" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <input type="text" name="adminDept" placeholder="Department" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary outline-none" />
              <input type="text" name="adminCode" placeholder="Admin Code" onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary outline-none" />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <div className="text-center mt-4">
            <Link to="/signin" className="text-primary hover:text-primary-dark font-medium hover:underline text-sm">
              Already have an account? Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
