// src/components/ProjectCard.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaStar } from 'react-icons/fa';
import './ProjectCard.css';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  if (!project) return null; // Or show a loading skeleton

  // This function stops the main card's click event when a button is clicked
  const handleActionClick = (e) => {
    e.stopPropagation();
    // Add your button-specific logic here (e.g., purchase, like)
    console.log("Action button was clicked!");
  };

  return (
    // The whole card is clickable
    <div className="project-card" onClick={() => navigate(`/projects/${project._id}`)}>
      
      {/* Left side: Logo, Title, Owner, Tags */}
      <div className="card-content-left">
        <img
          src={project.logoUrl || 'https://placehold.co/64x64'}
          alt="Project Logo"
          className="project-logo"
        />
        <div className="project-details">
          <h3>{project.title}</h3>
          <div className="project-meta">
            <div className="project-owner">
              <img
                src={project.owner?.profilePicture || 'https://placehold.co/24x24'}
                alt="Owner"
                className="owner-avatar"
              />
              <span>{project.owner?.username || 'Unknown'}</span>
            </div>
            <span className="star-rating"><FaStar /> {project.stars || 0}</span>
            {project.tags?.slice(0, 2).map((tag, i) => ( // Show max 2 tags
              <span key={i} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right side: Action Buttons */}
      <div className="card-actions-right">
        <button className="view-details-btn" onClick={handleActionClick}>
          View Details
        </button>
        <button className="purchase-btn" onClick={handleActionClick}>
          Purchase
        </button>
        <button className="like-btn" onClick={handleActionClick}>
          <FaHeart />
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;