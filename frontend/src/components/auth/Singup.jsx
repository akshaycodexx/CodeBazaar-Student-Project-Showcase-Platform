import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { UserPlus, Upload, User, Mail, Smartphone, Lock, Briefcase, Globe, Code, DollarSign } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

function InputField({ icon: Icon, type = "text", name, placeholder, value, onChange }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {Icon && <Icon className="h-5 w-5 text-gray-400" />}
      </div>
      <input
        type={type}
        name={name}
        required
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-500 transition-all"
      />
    </div>
  );
}

function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const [formdata, setFormdata] = useState({
    fullName: "", email: "", mobile: "", username: "", password: "",
    collegeName: "", branch: "", github: "", linkedin: "",
    companyName: "", designation: "", companyWebsite: "", recruiterLinkedin: "",
    adminDept: "", adminCode: "",
    pricePerSession: "", skills: "",
    role: "student",
  });
  const [profilePicture, setProfilePicture] = useState(null);

  const handleChange = (e) => setFormdata({ ...formdata, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    for (const key in formdata) { if (formdata[key]) data.append(key, formdata[key]); }
    if (profilePicture) data.append("profilePicture", profilePicture);
    data.append("role", role);

    try {
      await axios.post(`${API_URL}/api/signup`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });
      alert("Signup Successful!");
      navigate("/signin");
    } catch (error) {
      alert("Signup failed: " + (error.response?.data?.message || "Error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400">Join the elite coding community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-6">
            <label className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors overflow-hidden group">
              {profilePicture ? (
                <img src={URL.createObjectURL(profilePicture)} className="w-full h-full object-cover" />
              ) : (
                <Upload className="text-gray-500 group-hover:text-indigo-400" />
              )}
              <input type="file" className="hidden" accept="image/*" onChange={(e) => setProfilePicture(e.target.files[0])} />
            </label>
            <span className="text-xs text-gray-500 mt-2">Upload Profile Photo</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField icon={User} name="fullName" placeholder="Full Name" value={formdata.fullName} onChange={handleChange} />
            <InputField icon={Mail} type="email" name="email" placeholder="Email" value={formdata.email} onChange={handleChange} />
            <InputField icon={Smartphone} name="mobile" placeholder="Mobile" value={formdata.mobile} onChange={handleChange} />
            <InputField icon={User} name="username" placeholder="Username" value={formdata.username} onChange={handleChange} />
          </div>
          <InputField icon={Lock} type="password" name="password" placeholder="Password" value={formdata.password} onChange={handleChange} />

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">I am a...</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['student', 'recruiter', 'mentor', 'admin'].map((r) => (
                <button
                  key={r} type="button" onClick={() => setRole(r)}
                  className={`py-2 rounded-lg text-sm font-bold capitalize transition-all ${role === r ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Fields */}
          <motion.div key={role} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {role === 'student' && (
              <>
                <InputField icon={Briefcase} name="collegeName" placeholder="College Name" value={formdata.collegeName} onChange={handleChange} />
                <InputField icon={Code} name="branch" placeholder="Branch" value={formdata.branch} onChange={handleChange} />
                <InputField icon={Globe} name="github" placeholder="GitHub URL" value={formdata.github} onChange={handleChange} />
                <InputField icon={Globe} name="linkedin" placeholder="LinkedIn URL" value={formdata.linkedin} onChange={handleChange} />
              </>
            )}
            {role === 'recruiter' && (
              <>
                <InputField icon={Briefcase} name="companyName" placeholder="Company Name" value={formdata.companyName} onChange={handleChange} />
                <InputField icon={User} name="designation" placeholder="Designation" value={formdata.designation} onChange={handleChange} />
                <InputField icon={Globe} name="companyWebsite" placeholder="Company Website" value={formdata.companyWebsite} onChange={handleChange} />
                <InputField icon={Globe} name="recruiterLinkedin" placeholder="LinkedIn" value={formdata.recruiterLinkedin} onChange={handleChange} />
              </>
            )}
            {role === 'mentor' && (
              <>
                <InputField icon={Briefcase} name="companyName" placeholder="Current Company" value={formdata.companyName} onChange={handleChange} />
                <InputField icon={Code} name="skills" placeholder="Skills (comma separated)" value={formdata.skills} onChange={handleChange} />
                <InputField icon={Globe} name="linkedin" placeholder="LinkedIn" value={formdata.linkedin} onChange={handleChange} />
                <InputField icon={DollarSign} type="number" name="pricePerSession" placeholder="Price/Session (₹)" value={formdata.pricePerSession} onChange={handleChange} />
              </>
            )}
            {role === 'admin' && (
              <>
                <InputField icon={Briefcase} name="adminDept" placeholder="Department" value={formdata.adminDept} onChange={handleChange} />
                <InputField icon={Lock} name="adminCode" placeholder="Secret Code" value={formdata.adminCode} onChange={handleChange} />
              </>
            )}
          </motion.div>

          <button
            type="submit" disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1 transition-all"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="text-center">
            <Link to="/signin" className="text-indigo-400 hover:text-indigo-300 text-sm font-bold hover:underline">Already have an account? Sign In</Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default Signup;
