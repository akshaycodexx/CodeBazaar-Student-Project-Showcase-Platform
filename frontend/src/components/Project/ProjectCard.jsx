import React from 'react';
import { ExternalLink, Star, Code, ShoppingCart, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { handlePayment } from '../../utils/payment';
import { motion } from 'framer-motion';

const ProjectCard = ({ project, user }) => {
  const navigate = useNavigate();

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (!user) {
      if (window.confirm("Please login to purchase. Go to login?")) navigate('/signin');
      return;
    }
    handlePayment(project.price, project._id, user);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/projects/${project._id}`)}
      className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg hover:shadow-2xl border border-neutral-100 dark:border-neutral-700 overflow-hidden cursor-pointer group flex flex-col h-full transform transition-all duration-300"
    >
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={project.coverImageUrl || "https://source.unsplash.com/random/800x600/?code"}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-neutral-800 dark:text-white shadow-lg flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          {project.stars || 0}
        </div>

        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
          {project.liveDemoLink && (
            <a href={project.liveDemoLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="p-2 bg-white rounded-full text-neutral-900 hover:bg-neutral-200">
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow relative">
        <div className="mb-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {project.tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="text-[10px] uppercase tracking-wider font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-sm border border-indigo-100 dark:border-indigo-800">
                {tag}
              </span>
            ))}
          </div>

          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm line-clamp-2">
            {project.description}
          </p>
        </div>

        <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-700 flex items-center justify-between">
          <div className="flex items-center gap-2 group/owner" onClick={(e) => { e.stopPropagation(); navigate(`/profile/${project.owner?._id}`) }}>
            <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-700 overflow-hidden ring-2 ring-transparent group-hover/owner:ring-indigo-500 transition-all">
              <img
                src={project.owner?.profilePicture || `https://ui-avatars.com/api/?name=${project.owner?.username || 'User'}`}
                alt="Owner"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 group-hover/owner:text-indigo-600 transition-colors">
              {project.owner?.username || "Student"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-lg font-black text-neutral-900 dark:text-white">₹{project.price}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBuyNow}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2.5 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all"
              title="Buy Now"
            >
              <ShoppingCart className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
