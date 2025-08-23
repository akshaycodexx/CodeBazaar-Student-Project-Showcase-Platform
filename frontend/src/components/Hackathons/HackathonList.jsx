import React, { useEffect, useState } from "react";
import "./Hackathons.css";
const API_URL = import.meta.env.VITE_API_URL;
function Hackathons() {
  const [hackathons, setHackathons] = useState([]);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await fetch(`${API_URL}/api/hackathons`);
        const data = await res.json();
        setHackathons(data);
      } catch (err) {
        console.error("Error fetching hackathons:", err);
      }
    };
    fetchHackathons();
  }, []);

  return (
    <div className="hackathons">
      <h2>🚀 Upcoming Hackathons</h2>
      <div className="hackathon-list">
        {hackathons.map((hack) => (
          <div key={hack._id} className="hackathon-card">
            <div
              className="hackathon-image"
              style={{ backgroundImage: `url(${hack.imageUrl})` }}
            ></div>
            <div className="hackathon-content">
              <h3>{hack.title}</h3>
              <p>{hack.description}</p>
              <span className="hackathon-date">📅 {hack.date}</span>
              <button className="apply-btn">Apply Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hackathons;
