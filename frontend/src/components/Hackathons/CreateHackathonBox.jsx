import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

function CreateHackathonBox() {
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
      alert('Please wait while login status is being checked!');
      return;
    }
    if (isLoggedIn) {
      navigate("/hackSignup");
    } else {
      alert('Please login to upload Hackathon!');
    }
  };

  return (
    <div className="bg-indigo-600 pattern-bg py-12 px-4 text-center text-white">
      <div className="max-w-2xl mx-auto">
        <p className="text-2xl md:text-3xl font-bold mb-8">Build. Collaborate. Compete. Create now.</p>
        <button
          className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105"
          onClick={handleClicked}
          disabled={isLoading}
        >
          Create Hackathon
        </button>
      </div>
    </div>
  );
}

export default CreateHackathonBox;
