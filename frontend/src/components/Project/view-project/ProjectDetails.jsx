import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart, MessageCircle, Share2, ExternalLink, Send, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import ProjectCard from "./ProjectCard";
import PriceOptions from "./PriceOptions";
import DescriptionSection from "./DescriptionSection";
import LearningSection from "./LearningSection";
import ReviewsSection from "./ReviewsSection";
import ProjectAnalytics from "../ProjectAnalytics";
import "./ProjectDetails.css";
const API_URL = import.meta.env.VITE_API_URL;

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null); // Local user state for immediate feedback if needed, effectively handled by passed user prop usually but here specific fetch or context

  // Ideally user should be passed as context or prop. For now assuming we can check auth via cookie/localstorage or just try action and handle 401
  // But to show "Liked" state we need to know current user ID. 
  // Let's fetch current user info if not available globally here or assume parent passes it? 
  // The App.jsx passes user to routes but ProjectDetails is a route. Let's update App.jsx to pass User later or fetch 'me' here? 
  // Let's rely on 'me' endpoint or just try to like. 
  // Better: Fetch 'me' in a useEffect to know who is viewing.
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/me`, { withCredentials: true });
        setCurrentUser(res.data);
      } catch (e) {
        // Not logged in
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    // View Tracking
    const trackView = async () => {
      try {
        await axios.post(`${API_URL}/api/projects/${id}/view`);
      } catch (e) { console.error("View track failed"); }
    };
    trackView();
  }, [id]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/projects/${id}`, { withCredentials: true })
      .then((res) => {
        setProject(res.data);
        setLikes(res.data.likes || []);
        setComments(res.data.comments || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching project:", err);
        setLoading(false);
      });
  }, [id]);

  const handleLike = async () => {
    if (!currentUser) {
      toast.error("Please login to like projects");
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/api/projects/${project._id}/like`, {}, { withCredentials: true });
      setLikes(res.data); // Update likes array from backend response
      toast.success(res.data.includes(currentUser._id) ? "Project Liked!" : "Project Unliked");
    } catch (err) {
      toast.error("Failed to update like");
    }
  };

  const handleComment = async () => {
    if (!currentUser) {
      toast.error("Please login to comment");
      return;
    }
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(`${API_URL}/api/projects/${project._id}/comment`, { text: newComment }, { withCredentials: true });
      setComments(res.data);
      setNewComment("");
      toast.success("Comment added!");
    } catch (err) {
      toast.error("Failed to post comment");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (loading) return <div className="loading">Loading project...</div>;
  if (!project) return <div className="error">Project not found</div>;

  const isLiked = currentUser && likes.includes(currentUser._id);

  return (
    <div className="project-detail-container">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-neutral-900">{project.title}</h1>
          <div className="flex gap-2">
            {project.liveDemoLink && (
              <a
                href={project.liveDemoLink}
                target="_blank"
                rel="noreferrer"
                onClick={() => axios.post(`${API_URL}/api/projects/${project._id}/click`)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Live Demo
              </a>
            )}
            <button onClick={handleShare} className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <ProjectCard project={project} />

        {/* Analytics Section (Only for Owner) */}
        {currentUser && project.owner === currentUser._id && (
          <div className="mt-8">
            <ProjectAnalytics project={project} />
          </div>
        )}

        {/* Interaction Bar */}
        <div className="flex items-center gap-6 mt-6 border-t border-neutral-100 pt-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${isLiked ? 'bg-pink-50 text-pink-600' : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'}`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="font-semibold">{likes.length || 0} Likes</span>
          </button>
          <div className="flex items-center gap-2 text-neutral-600 px-4 py-2">
            <MessageCircle className="w-5 h-5" />
            <span className="font-semibold">{comments.length || 0} Comments</span>
          </div>
        </div>
      </div>

      <PriceOptions project={project} />

      {/* Add to Cart Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={async () => {
            if (!currentUser) return toast.error("Please login first");
            try {
              await axios.post(`${API_URL}/api/cart/add`, { projectId: project._id }, { withCredentials: true });
              toast.success("Added to Cart!");
            } catch (err) {
              toast.error(err.response?.data?.message || "Failed to add to cart");
            }
          }}
          className="flex items-center gap-2 bg-neutral-900 hover:bg-black text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all transform hover:-translate-y-1"
        >
          <ShoppingBag className="w-5 h-5" /> Add to Cart
        </button>
      </div>

      {/* Tabs for Description, Learning, Devlog */}
      <div className="flex border-b border-neutral-200 mt-8 mb-6">
        <button className="px-6 py-3 font-bold border-b-2 border-primary text-primary">Overview</button>
        <button className="px-6 py-3 font-bold text-neutral-500 hover:text-neutral-800">Devlogs ({project.updates?.length || 0})</button>
      </div>

      {/* Simplified for Prototype: Just list Devlogs below description for now, or separate section */}
      {/* Actually, let's make it a distinct section at the bottom before comments since Tabs logic requires state. */}
      {/* Let's add a "Recent Updates" Section */}

      <div className="bg-neutral-50 rounded-xl p-6 mb-8 border border-neutral-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-neutral-900">Project Updates (Devlog)</h3>
          {currentUser && project.owner === currentUser._id && (
            <button
              onClick={() => {
                const title = prompt("Update Title:");
                if (!title) return;
                const desc = prompt("Update Description:");
                if (!desc) return;

                axios.post(`${API_URL}/api/projects/${project._id}/updates`, { title, description: desc }, { withCredentials: true })
                  .then(res => {
                    setProject(prev => ({ ...prev, updates: res.data })); // Optimistic or strictly sync
                    toast.success("Update Posted!");
                  })
                  .catch(err => toast.error("Failed to post update"));
              }}
              className="text-sm bg-neutral-900 text-white px-3 py-1 rounded-lg"
            >
              + Post Update
            </button>
          )}
        </div>

        <div className="space-y-4">
          {project.updates && project.updates.length > 0 ? (
            project.updates.map((update, i) => (
              <div key={i} className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm">
                <div className="flex justify-between mb-2">
                  <h4 className="font-bold text-neutral-800">{update.title}</h4>
                  <span className="text-xs text-neutral-500">{new Date(update.date).toLocaleDateString()}</span>
                </div>
                <p className="text-neutral-600 text-sm">{update.description}</p>
              </div>
            ))
          ) : (
            <p className="text-neutral-500 italic text-sm">No updates posted yet.</p>
          )}
        </div>
      </div>

      <div className="details-columns">
        <DescriptionSection description={project.description} />
        <LearningSection learning={project.learning || []} />
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mt-8 w-full max-w-screen-xl mx-auto">
        <h3 className="text-xl font-bold text-neutral-900 mb-6">Discussion</h3>

        {/* Comment Form */}
        <div className="flex gap-4 mb-8">
          <div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden shrink-0">
            {currentUser ? (
              <img src={currentUser.profilePicture || "/default-avatar.png"} alt="User" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400">?</div>
            )}
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={currentUser ? "Add a comment..." : "Login to comment"}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleComment()}
              disabled={!currentUser}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-full py-3 px-6 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button
              onClick={handleComment}
              disabled={!currentUser || !newComment.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-full hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment, index) => (
            <div key={index} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden shrink-0 cursor-pointer" onClick={() => navigate(`/profile/${comment.user?._id}`)}>
                <img src={comment.user?.profilePicture || "/default-avatar.png"} alt={comment.user?.username} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-bold text-neutral-900 cursor-pointer hover:text-primary transition-colors" onClick={() => navigate(`/profile/${comment.user?._id}`)}>{comment.user?.username || "Unknown User"}</span>
                  <span className="text-xs text-neutral-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-neutral-700 leading-relaxed">{comment.text}</p>
              </div>
            </div>
          ))}
          {comments.length === 0 && <p className="text-neutral-400 italic">No comments yet. Be the first to share your thoughts!</p>}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
