import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProjectCard from './ProjectCard';
const API_URL = import.meta.env.VITE_API_URL;

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/projects/getallprojects`, {
        withCredentials: true
      });
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-3xl font-bold text-neutral-900 text-center mb-10">All Student Projects</h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-neutral-500">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-neutral-200">
            <p className="text-xl text-neutral-500">No projects found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {/* Using a vertical list layout for project cards as per design commonly used for detailed list items, or change to grid-cols-1 md:grid-cols-2 lg:grid-cols-3 if cards are smaller */}
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
