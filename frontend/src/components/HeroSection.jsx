import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import heroImage from '../assets/hero1.png';

const API_URL = import.meta.env.VITE_API_URL;

function HeroSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/check-auth-status`, {
          withCredentials: true,
        });
        setIsLoggedIn(response.data.isLoggedIn);
      } catch (error) {
        setIsLoggedIn(false);
        console.error(`Login status check failed: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  const handleClick = () => {
    if (isLoading) {
      alert("Please wait while login status is being checked.");
      return;
    }
    if (isLoggedIn) {
      navigate("/projectUpload");
    } else {
      alert("Please login to upload project!");
      navigate("/signin");
    }
  };

  return (
    <section className="bg-gradient-to-b from-indigo-50 to-white py-20 lg:py-32">
      <div className="max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold text-neutral-900 leading-tight mb-6">
            Showcase & Earn from <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Your Student Projects</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 mb-8 max-w-2xl mx-auto md:mx-0">
            Don't let your college projects catch dust. Upload them, build your portfolio, and earn money from other learners.
          </p>
          <button
            onClick={handleClick}
            disabled={isLoading}
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-primary hover:bg-primary-dark rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upload Project
            <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
        </div>

        <div className="flex-1 w-full max-w-lg md:max-w-none">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-30 animate-pulse"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl p-4 overflow-hidden">
              <img src={heroImage} alt="Showcase project" className="w-full h-auto rounded-lg transform transition hover:scale-105 duration-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
