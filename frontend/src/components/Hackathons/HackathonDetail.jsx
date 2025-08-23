import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./HackathonDetail.css";

function HackathonDetail() {
  const { id } = useParams();
  const [hackathon, setHackathon] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL; // use env

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

  if (!hackathon) return <p className="loading">Loading...</p>;

  return (
    <div className="hackathon-detail">
      <div className="hackathon-banner">
        <img src={hackathon.bannerUrl} alt={hackathon.title} />
      </div>

      <div className="hackathon-content">
        <h1>{hackathon.title}</h1>
        <p className="description">{hackathon.description}</p>

        <div className="hackathon-info">
          <p><strong>Start Date:</strong> {new Date(hackathon.startDate).toDateString()}</p>
          <p><strong>End Date:</strong> {new Date(hackathon.endDate).toDateString()}</p>
          <p><strong>Location:</strong> {hackathon.location}</p>
        </div>

        <div className="hackathon-extra">
          <h3>Rewards & Prizes</h3>
          <p>{hackathon.rewards}</p>
        </div>
      </div>
    </div>
  );
}

export default HackathonDetail;
