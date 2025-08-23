// src/components/HackathonDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiCalendar, FiMapPin, FiAward, FiUsers } from "react-icons/fi";
import "./HackathonDetail.css";

function HackathonDetail() {
  const { id } = useParams();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Reset states for new ID
    setHackathon(null);
    setLoading(true);
    setError(null);
    
    const fetchHackathon = async () => {
      try {
        const res = await fetch(`${API_URL}/api/hackathons/${id}`);
        // If the server responds with 404, res.ok will be false
        if (!res.ok) {
          throw new Error("Hackathon not found (404)");
        }
        const data = await res.json();
        setHackathon(data);
      } catch (err) {
        console.error("Error fetching hackathon:", err);
        setError(err.message); // Store the error message
      } finally {
        setLoading(false); // Stop loading in any case
      }
    };
    
    fetchHackathon();
  }, [id, API_URL]);

  // State 1: Loading
  if (loading) {
    return (
      <div className="status-container">
        <div className="spinner"></div>
        <p>Loading Hackathon Details...</p>
      </div>
    );
  }

  // State 2: Error or Not Found
  if (error) {
    return (
      <div className="status-container">
        <h2>Oops! Hackathon Not Found</h2>
        <p>We couldn't find the hackathon you were looking for.</p>
        <Link to="/" className="btn-primary">
          &larr; Back to All Hackathons
        </Link>
      </div>
    );
  }
  
  // State 3: Success (hackathon is not null)
  if (!hackathon) return null; // Should not happen if logic is correct, but a safe fallback

  // Destructure data with default values to prevent crashes
  const {
    title = "Untitled Hackathon",
    description = "No description available.",
    coverImage, // Use the field name from your backend
    startDate,
    endDate,
    location = "Online",
    prizes = "To be announced",
    registrationLink = "#",
    teamSizeMin = 1,
    teamSizeMax = 5,
  } = hackathon;

  return (
    <div className="hackathon-detail-page">
      <header className="hero-section" style={{ backgroundImage: `url(${coverImage})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">{title}</h1>
          <p className="hero-subtitle">The ultimate innovation challenge awaits.</p>
          <a href={registrationLink} target="_blank" rel="noopener noreferrer" className="btn-primary hero-btn">
            Register Now
          </a>
        </div>
      </header>

      <div className="detail-container">
        <main className="main-content">
          <section className="detail-section">
            <h2>About this Hackathon</h2>
            <p>{description}</p>
          </section>

          <section className="detail-section">
            <h2><FiAward /> Prizes & Rewards</h2>
            <p>{prizes}</p>
          </section>
        </main>

        <aside className="sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-title">Hackathon Info</h3>
            <ul className="info-list">
              <li>
                <FiCalendar />
                <div>
                  <strong>Dates</strong>
                  <span>
                    {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                  </span>
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
            <a href={registrationLink} target="_blank" rel="noopener noreferrer" className="btn-primary sidebar-btn">
              Join The Challenge
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default HackathonDetail;