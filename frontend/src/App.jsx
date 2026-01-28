import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Toaster } from 'react-hot-toast';

import Navbar from "./components/Navbar";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Singup";
import MainPage from "./MainPage";
import TutorialUploadForm from "./components/toturials/TutorialUploadForm";
import Hackathon from "./components/Hackathons/App"
import HackathonCreateForm from "./components/Hackathons/HackathonForm";
import UploadProject from "./components/Project/UploadProject";
import ProjectCard from "./components/Project/ProjectCard";
import AllProject from "./components/Project/App"
import ProjectCardPage from "./components/Project/ProjectCardPage";
import ProjectDetails from "./components/Project/view-project/ProjectDetails";
import HackathonDetail from "./components/Hackathons/HackathonDetail";
import EditProfile from "./components/auth/EditProfile";
import Dashboard from "./components/Dashboard/Dashboard";
import Pricing from "./components/Pricing";
import Mentorship from "./components/Mentorship/Mentorship";
import RecruitersPanel from "./components/Recruiter/RecruitersPanel";
import UserProfile from "./components/Profile/UserProfile";
import AdminDashboard from "./components/Admin/AdminDashboard";
import Chat from "./components/Chat/Chat";
import Cart from "./components/Cart/Cart";
import HelpSupport from "./components/HelpSupport";
import Leaderboard from "./components/Leaderboard";
import ResumeBuilder from "./components/ResumeBuilder";
import CommandPalette from "./components/CommandPalette";
import JobBoard from "./components/JobBoard";
import PostJob from "./components/PostJob";
import InterviewDashboard from "./components/Interview/InterviewDashboard";
import InterviewRoom from "./components/Interview/InterviewRoom";


const API_URL = import.meta.env.VITE_API_URL;



import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const [user, setuser] = useState(null);
  const [tutorials, setTutorials] = useState([]);

  const getuser = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/check-auth-status`, { withCredentials: true });
      if (res.data.isLoggedIn) {
        setuser(res.data.user);
      }
    } catch (err) {
      console.log("Not logged in");
    }
  };

  const fetchTutorials = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/photos`, { withCredentials: true });
      setTutorials(res.data);
    } catch (err) {
      console.error("Tutorial fetch failed:", err.message);
    }
  };

  useEffect(() => {
    getuser();
    fetchTutorials();
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Navbar user={user} setuser={setuser} />
        <CommandPalette />
        <Routes>
          <Route path="/" element={<MainPage tutorials={tutorials} setTutorials={setTutorials} user={user} />} />
          <Route path="/signin" element={<Signin setuser={setuser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/upload" element={<TutorialUploadForm />} />

          <Route path="/edit-profile" element={<EditProfile user={user} setuser={setuser} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/pricing" element={<Pricing user={user} />} />
          <Route path="/mentorship" element={<Mentorship user={user} />} />
          <Route path="/recruiters" element={<RecruitersPanel />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/help" element={<HelpSupport />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/resume" element={<ResumeBuilder />} />
          <Route path="/jobs" element={<JobBoard user={user} />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/interviews" element={<InterviewDashboard user={user} />} />
          <Route path="/interviews/:id/room" element={<InterviewRoom user={user} />} />


          <Route path="/hack" element={<Hackathon />} />
          <Route path="/hackSignup" element={<HackathonCreateForm />} />
          <Route path="/hackathons/:id" element={<HackathonDetail />} />



          {/* //projects */}
          <Route path="/projectUpload" element={<UploadProject user={user} />} />
          <Route path="/getallprojects" element={<AllProject user={user} />} />

          {/* //view project */}
          {/* //If using React Router, in App.jsx */}
          <Route path="/projects/:id" element={<ProjectDetails />} />


        </Routes>
      </BrowserRouter>
    </ThemeProvider >
  );
}

export default App;
