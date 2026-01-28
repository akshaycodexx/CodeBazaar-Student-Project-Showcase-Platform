import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaStar } from 'react-icons/fa';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  if (!project) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md border border-neutral-100 p-6 transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <img
          src={project.logoUrl || 'https://placehold.co/80'}
          alt="Project Logo"
          className="w-20 h-20 rounded-xl object-cover border border-neutral-100 shadow-sm shrink-0 bg-neutral-50"
        />

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2 truncate">{project.title}</h3>
              <p className="text-neutral-500 text-sm line-clamp-2 md:line-clamp-1 mb-4">{project.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <img
                src={project.owner?.profilePicture || 'https://placehold.co/32'}
                alt="Owner"
                className="w-8 h-8 rounded-full border border-white shadow-sm object-cover"
              />
              <div>
                <span className="block font-semibold text-neutral-800">{project.owner?.username || 'Unknown'}</span>
                <span className="block text-xs text-neutral-400">Student Developer</span>
              </div>
            </div>

            <div className="hidden md:block h-8 w-px bg-neutral-200"></div>

            <div className="flex items-center gap-4 text-neutral-600">
              <span className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-2 py-1 rounded-md text-xs font-bold border border-yellow-100">
                <FaStar className="w-3 h-3" /> {project.stars || 0}
              </span>

              <div className="flex gap-2">
                {project.tags?.slice(0, 3).map((tag, i) => (
                  <span key={i} className="bg-neutral-100 text-neutral-600 px-2 py-1 rounded-md text-xs font-medium border border-neutral-200">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row md:flex-col w-full md:w-auto gap-3 mt-4 md:mt-0 shrink-0">
          <button className="flex-1 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
            Purchase
          </button>
          <button
            className="flex-1 bg-white hover:bg-indigo-50 text-primary border border-primary px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            onClick={() => navigate(`/projects/${project._id}`)}
          >
            View Details
          </button>
          <button className="text-neutral-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 self-center md:self-end">
            <FaHeart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
