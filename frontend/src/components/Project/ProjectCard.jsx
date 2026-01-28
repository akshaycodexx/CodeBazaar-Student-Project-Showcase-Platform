import React from 'react';
import { ExternalLink, Star, Code, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { handlePayment } from '../../utils/payment';

const ProjectCard = ({ project, user }) => {
  const navigate = useNavigate();

  const handleBuyNow = (e) => {
    e.stopPropagation(); // Prevent card click
    if (!user) {
      if (window.confirm("Please login to purchase. Go to login?")) {
        navigate('/signin');
      }
      return;
    }
    handlePayment(project.price, project._id, user);
  };

  return (
    <div
      onClick={() => navigate(`/projects/${project._id}`)}
      className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.coverImageUrl}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-neutral-800 shadow-sm flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          {project.stars || 0}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-neutral-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {project.title}
        </h3>

        <p className="text-neutral-600 text-sm mb-4 line-clamp-2 flex-grow">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full border border-neutral-200">
              {tag}
            </span>
          ))}
        </div>

        <div className="border-t border-neutral-100 pt-4 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2 group/owner cursor-pointer" onClick={(e) => { e.stopPropagation(); navigate(`/profile/${project.owner?._id}`) }}>
            <div className="w-6 h-6 rounded-full bg-neutral-200 overflow-hidden ring-1 ring-neutral-100 group-hover/owner:ring-primary transition-all">
              {project.owner?.profilePicture && <img src={project.owner.profilePicture} alt="Owner" className="w-full h-full object-cover" />}
            </div>
            <span className="text-xs font-medium text-neutral-700 group-hover/owner:text-primary transition-colors">{project.owner?.username || "Student"}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-primary">₹{project.price}</span>
            <button
              onClick={handleBuyNow}
              className="bg-primary hover:bg-primary-dark text-white p-2 rounded-lg transition-colors shadow-sm"
              title="Buy Now"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
