import React, { useEffect, useState } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

function ProjectsShowcase() {
  const [projects, setProject] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/projects/getallprojects`, {
          withCredentials: true,
        });

        let allProjects = response.data || [];
        // Randomly shuffle & take only 2
        const randomtwo = allProjects
          .sort(() => 0.5 - Math.random())
          .slice(0, 2);
        setProject(randomtwo);
      } catch (error) {
        console.error(`project fetching error ${error}`);
      }
    };
    fetchPosts();
  }, []);

  return (
    <section className="py-16 bg-neutral-100">
      <div className="max-w-screen-xl mx-auto px-4 flex flex-col lg:flex-row gap-12">

        {/* Left Section: Projects */}
        <div className="lg:flex-[2]">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">Explore Student Projects</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {projects.map((project) => (
              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300" key={project._id}>
                <div className="h-48 bg-neutral-200 overflow-hidden relative group">
                  <img
                    src={project.coverImageUrl || 'placeholder.jpg'}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                </div>
                <div className="p-5">
                  <h4 className="text-lg font-bold text-neutral-800 mb-1">{project.title}</h4>
                  <p className="text-sm text-neutral-500">by {project.owner?.name || 'Unknown'}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-indigo-50 p-8 rounded-xl text-center border border-indigo-100">
            <h4 className="text-xl font-bold text-indigo-900 mb-2">Want to showcase your work?</h4>
            <p className="text-indigo-700 mb-6">Upload your tutorials, projects, and get discovered.</p>
            <button className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-md">
              Upload Project
            </button>
          </div>
        </div>

        {/* Right Section: Sidebar */}
        <div className="lg:flex-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
            <h3 className="text-lg font-bold text-neutral-800 mb-2">Paid Video Tutorials</h3>
            <p className="text-sm text-neutral-500 mb-4">Upload tutorials. Participants get 90% revenue.</p>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-neutral-900">
              <iframe
                className="w-full h-48 rounded-lg"
                src="https://www.youtube.com/embed/wHPEBQu90Qs"
                title="Tutorial Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-200 hover:border-primary/30 transition-colors cursor-pointer">
              <h4 className="font-bold text-neutral-800">Jan Hackathons</h4>
              <p className="text-sm text-neutral-500">Earning coding projects</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-200 hover:border-primary/30 transition-colors cursor-pointer">
              <h4 className="font-bold text-neutral-800">Live Demos & Showcases</h4>
              <p className="text-sm text-neutral-500">Participate in projects</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default ProjectsShowcase;
