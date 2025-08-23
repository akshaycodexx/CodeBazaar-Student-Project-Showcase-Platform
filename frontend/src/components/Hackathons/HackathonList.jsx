// src/components/HackathonList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { FiCalendar, FiMapPin } from 'react-icons/fi'; // Import icons
import './HackathonList.css'; // We will create this new CSS file

// Helper function to format the date nicely
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

function HackathonList() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await fetch(`${API_URL}/api/hackathons`);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        // Assuming tags might be a comma-separated string, let's make it an array
        const formattedData = data.map(hack => ({
            ...hack,
            tags: Array.isArray(hack.tags) ? hack.tags : hack.tags?.split(',').map(tag => tag.trim()) || []
        }));
        setHackathons(formattedData);
      } catch (error) {
        console.error('Error fetching hackathons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, [API_URL]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Finding awesome hackathons...</p>
      </div>
    );
  }

  return (
    <div className="hackathon-list-container">
      <h1 className="list-title">Upcoming Hackathons 🚀</h1>
      {hackathons.length === 0 ? (
        <div className="empty-state">
          <h2>No Hackathons Found</h2>
          <p>Check back later or try creating a new one!</p>
        </div>
      ) : (
        <div className="hackathon-grid">
          {hackathons.map((hack) => (
            // The entire card is a link to the details page
            <Link to={`/hackathons/${hack._id}`} className="hackathon-card" key={hack._id}>
              <div 
                className="card-background" 
                style={{ backgroundImage: `url(${hack.coverImage})` }}
              ></div>
              <div className="card-overlay"></div>
              
              <div className="card-content">
                <div className="card-header">
                   {hack.logoImage && <img src={hack.logoImage} alt={`${hack.title} Logo`} className="card-logo" />}
                   <div className="card-tags">
                    {hack.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="card-body">
                  <h3 className="card-title">{hack.title}</h3>
                  <p className="card-description">{hack.shortDescription}</p>
                </div>
                
                <div className="card-footer">
                  <div className="card-info">
                    <span><FiCalendar /> {formatDate(hack.startDate)}</span>
                    <span><FiMapPin /> {hack.location}</span>
                  </div>
                  <span className="card-cta">View Details &rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default HackathonList;