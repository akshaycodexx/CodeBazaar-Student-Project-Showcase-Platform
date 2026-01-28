import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowRight, Code, DollarSign, Rocket } from 'lucide-react';
import heroImage from '../assets/hero1.png';

const API_URL = import.meta.env.VITE_API_URL;

function HeroSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/check-auth-status`, { withCredentials: true });
        setIsLoggedIn(response.data.isLoggedIn);
      } catch (error) { setIsLoggedIn(false); }
    };
    checkLoginStatus();
  }, []);

  const handleClick = () => {
    isLoggedIn ? navigate("/projectUpload") : navigate("/signin");
  };

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-neutral-900 via-neutral-900 to-indigo-900 text-white overflow-hidden pt-20">

      {/* Background Animated Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
      </div>

      <div className="container mx-auto px-4 z-10 flex flex-col md:flex-row items-center gap-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-md">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-green-300">#1 Place for Student Developers</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
            Turn Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">Code to Cash</span>
          </h1>

          <p className="text-xl text-neutral-300 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
            Stop letting your GitHub repos gather dust. Showcase your academic projects, get hired by top recruiters, or sell them to juniors.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClick}
              className="px-8 py-4 bg-indigo-600 rounded-full font-bold text-lg shadow-lg shadow-indigo-500/30 flex items-center gap-2 hover:bg-indigo-700 transition-all"
            >
              Start Uploading <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/getallprojects')}
              className="px-8 py-4 bg-white/10 border border-white/20 rounded-full font-bold text-lg hover:bg-white/20 transition-all backdrop-blur-md"
            >
              Explore Projects
            </motion.button>
          </div>

          <div className="mt-12 flex items-center justify-center md:justify-start gap-8 text-neutral-400">
            <div className="flex items-center gap-2">
              <Code className="text-indigo-400" /> <span>500+ Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="text-green-400" /> <span>₹1.2M Earned</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket className="text-pink-400" /> <span>Hired by MNCs</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1 }}
          className="flex-1 w-full max-w-lg"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative bg-neutral-800 border border-neutral-700 rounded-3xl p-2 shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500">
              <img src={heroImage} alt="Dashboard Preview" className="rounded-2xl w-full" />

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-6 -left-6 bg-white text-neutral-900 p-4 rounded-xl shadow-xl border border-neutral-200 flex items-center gap-3"
              >
                <div className="bg-green-100 p-2 rounded-full text-green-600 font-bold">₹</div>
                <div>
                  <div className="text-xs text-neutral-500 font-bold">Just Sold</div>
                  <div className="font-bold">E-Commerce App</div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
