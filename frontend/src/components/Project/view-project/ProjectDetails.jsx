import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProjectCard from "./ProjectCard";
import PriceOptions from "./PriceOptions";
import DescriptionSection from "./DescriptionSection";
import LearningSection from "./LearningSection";
import ReviewsSection from "./ReviewsSection";
import "./ProjectDetails.css";

const ProjectDetails = () => {
  const { id } = useParams(); // ✅ Fetch the project ID from the URL
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/projects/${id}`,{withCredentials:true})
      .then((res) => {
        setProject(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching project:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loading">Loading project...</div>;

  if (!project) return <div className="error">Project not found</div>;

  return (
    <div className="project-detail-container">
      <ProjectCard project={project} />

      <PriceOptions />

      <div className="details-columns">
        <DescriptionSection />
        <LearningSection learning={project.learning || []} />
      </div>

      <ReviewsSection comments={project.Comment} />
    </div>
  );
};

export default ProjectDetails;
