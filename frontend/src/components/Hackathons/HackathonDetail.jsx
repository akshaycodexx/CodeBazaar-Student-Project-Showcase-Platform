// src/components/HackathonDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiCalendar, FiMapPin, FiAward, FiUsers } from "react-icons/fi"; // Import icons
import "./HackathonDetail.css";

function HackathonDetail() {
  const { id } = useParams();
  const [hackathon, setHackathon] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const res = await fetch(`${API_URL}/api/hackathons/${id}`);
        if (!res.ok) throw new Error("Failed to fetch hackathon");
        const data = await res.json();
        setHackathon(data);
      } catch (err) {
        console.error("Error fetching hackathon:", err);
      }
    };
    fetchHackathon();
  }, [id, API_URL]);

  if (!hackathon) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Hackathon Details...</p>
      </div>
    );
  }

  // Destructure all potential properties for a richer UI
  const {
    title,
    description,
    coverImage, // Using 'coverImage' as it's more common
    startDate,
    endDate,
    location,
    prizes, // Renamed from 'rewards'
    registrationLink,
    teamSizeMin = 1, // Providing default values
    teamSizeMax = 5,
  } = hackathon;

  return (
    <div className="hackathon-detail-page">
      {/* --- 1. Hero Section --- */}
      <header className="hero-section" style={{ backgroundImage: `url(${coverImage})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">{title}</h1>
          <p className="hero-subtitle">The ultimate innovation challenge awaits.</p>
          <a href={registrationLink || '#'} target="_blank" rel="noopener noreferrer" className="btn-primary hero-btn">
            Register Now
          </a>
        </div>
      </header>

      {/* --- 2. Main Content Area (Two-Column Layout) --- */}
      <div className="detail-container">
        <main className="main-content">
          <section className="detail-section">
            <h2>About this Hackathon</h2>
            <p>{description}</p>
          </section>

          <section className="detail-section">
            <h2><FiAward /> Prizes & Rewards</h2>
            <p>{prizes || 'Details about prizes will be announced soon.'}</p>
          </section>

          {/* You can add more sections here like Rules, Judging Criteria, etc. */}
        </main>

        {/* --- 3. Sticky Sidebar --- */}
        <aside className="sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-title">Hackathon Info</h3>
            <ul className="info-list">
              <li>
                <FiCalendar />
                <div>
                  <strong>Dates</strong>
                  <span>{new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}</span>
                </div>
              </li>
              <li>
                <FiMapPin />
                <div>
                  <strong>Location</strong>
                  <span>{location}</span>
                </div>
              </li>
              <li>
                <FiUsers />
                <div>
                  <strong>Team Size</strong>
                  <span>{teamSizeMin} - {teamSizeMax} members</span>
                </div>
              </li>
            </ul>
            <a href={registrationLink || '#'} target="_blank" rel="noopener noreferrer" className="btn-primary sidebar-btn">
              Join The Challenge
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default HackathonDetail;