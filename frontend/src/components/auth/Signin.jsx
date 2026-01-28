import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function Signin({ setuser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/signin`,
        formData,
        { withCredentials: true }
      );
      setuser(res.data.user);
      navigate("/");
    } catch (error) {
      console.error("Login Failed:", error.response?.data || error.message);
      alert("Login failed: " + (error.response?.data?.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-neutral-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900">Welcome Back</h2>
          <p className="text-neutral-500 mt-2">Sign in to continue to CodeBazaar</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="text-center mt-6">
            <Link to="/signup" className="text-primary hover:text-primary-dark font-medium hover:underline text-sm">
              Don't have an account? Create one
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signin;
