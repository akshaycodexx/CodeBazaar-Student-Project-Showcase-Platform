// src/components/HackathonList.jsx
import React, { useEffect, useState } from 'react';
import './HackathonList.css';

function HackathonList() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await fetch(`${API_URL}/api/hackathons`, {
          method: 'GET',
          credentials: 'include', // important if using cookies
        });
        const data = await res.json();
        setHackathons(data);
      } catch (error) {
        console.error('Error fetching hackathons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  if (loading) return <p>Loading hackathons...</p>;

  return (
    <div className="upcoming">
      <h2>Upcoming Hackathons</h2>
      {hackathons.length === 0 ? (
        <p>No hackathons available</p>
      ) : (
        hackathons.map((hack) => (
          <div className="card" key={hack._id}>
            <img src={hack.image} alt={hack.title} />
            <div className="card-content">
              <h3>{hack.title}</h3>
              <p>{hack.description}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default HackathonList;
