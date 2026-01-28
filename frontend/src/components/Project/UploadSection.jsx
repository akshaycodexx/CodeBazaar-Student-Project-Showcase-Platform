import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

const UploadSection = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checklogin = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/check-auth-status`, {
          withCredentials: true,
        });
        setIsLoggedIn(response.data.isLoggedIn);
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    checklogin();
  }, []);

  const handleClicked = () => {
    if (isLoading) {
      alert('Please wait while login status is checked!');
      return;
    }
    if (isLoggedIn) {
      navigate("/hackSignup")
    }
    else {
      alert('Please login to upload Projects!')
    }
  }

  return (
    <div className="py-20 bg-gradient-to-br from-indigo-50 to-white text-center">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 mb-6 leading-tight animate-fade-in-up">
          Showcase & Earn <br /> <span className="text-primary">from Your Student Projects</span>
        </h1>
        <p className="text-xl text-neutral-600 mb-8 animate-fade-in-up delay-100">Upload coding project and make money</p>
        <button
          className="bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-8 rounded-lg shadow-lg transition-transform transform hover:-translate-y-1 animate-fade-in-up delay-200"
          onClick={handleClicked}
          disabled={isLoading}
        >
          Upload Project
        </button>
      </div>
    </div>
  );
};

export default UploadSection;