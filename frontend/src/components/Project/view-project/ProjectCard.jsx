import React from "react";
import { useNavigate } from 'react-router-dom';
import "./ProjectCard.css";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  return (
    <div className="project-card">
      <div className="card-header">
        <img src={project.coverImageUrl} alt="cover" className="cover-img" />
        <div className="text-info">
          <h2>Task Management App</h2>
          <p>A web-based task management application</p>
          <a href="#">Live Demo</a>
        </div>
      </div>

      <div className="author-section" onClick={() => navigate(`/profile/${project.owner._id}`)} style={{ cursor: 'pointer' }}>
        <img src={project.owner.profilePicture || "https://placehold.co/50"} alt="author" className="author-img" />
        <div>
          <h4>{project.owner.username}</h4>
          <p className="verified">✔ Verified</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
