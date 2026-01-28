import React from 'react';
import ProjectCard from './ProjectCard';

const ProjectList = ({ projects, loading, user }) => {
  return (
    <div className="min-h-[50vh] bg-neutral-50 py-12 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-neutral-900">Explore Projects</h2>
          <span className="text-neutral-500 text-sm">{projects.length} results</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-neutral-500">Finding best projects for you...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-neutral-200">
            <p className="text-xl text-neutral-500">No projects found matching your criteria.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-primary font-medium hover:underline"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
