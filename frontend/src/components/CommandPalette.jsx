import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, FileText, User, Layout, ExternalLink } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const CommandPalette = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    // Toggle on Ctrl+K or Cmd+K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Search Projects when query changes
    useEffect(() => {
        const searchProjects = async () => {
            if (query.length > 2) {
                try {
                    const res = await axios.get(`${API_URL}/api/projects/getallprojects?search=${query}`);
                    setProjects(res.data.projects || []);
                } catch (err) {
                    console.error("Search failed");
                }
            } else {
                setProjects([]);
            }
        };
        const timer = setTimeout(searchProjects, 300); // Debounce
        return () => clearTimeout(timer);
    }, [query]);

    if (!isOpen) return null;

    const staticActions = [
        { name: 'Dashboard', icon: <Layout className="w-4 h-4" />, action: () => navigate('/dashboard') },
        { name: 'Profile', icon: <User className="w-4 h-4" />, action: () => navigate('/edit-profile') }, // Assuming edit-profile or view profile logic
        { name: 'Mentorship', icon: <User className="w-4 h-4" />, action: () => navigate('/mentorship') },
        { name: 'Leaderboard', icon: <Layout className="w-4 h-4" />, action: () => navigate('/leaderboard') },
        { name: 'Help & Support', icon: <Search className="w-4 h-4" />, action: () => navigate('/help') },
    ];

    const filteredActions = staticActions.filter(action =>
        action.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center pt-[20vh] animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[60vh]">
                <div className="p-4 border-b border-neutral-200 flex items-center gap-3">
                    <Search className="w-5 h-5 text-neutral-400" />
                    <input
                        type="text"
                        autoFocus
                        placeholder="Type a command or search..."
                        className="flex-1 outline-none text-lg text-neutral-800 placeholder:text-neutral-400"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-neutral-500 bg-neutral-100 border border-neutral-200 rounded-lg">
                        <span className="text-xs">ESC</span>
                    </kbd>
                </div>

                <div className="overflow-y-auto p-2">
                    {/* Static Actions */}
                    {filteredActions.length > 0 && (
                        <div className="mb-2">
                            <h3 className="text-xs font-semibold text-neutral-400 px-3 py-2 uppercase">Actions</h3>
                            {filteredActions.map((action, i) => (
                                <button
                                    key={i}
                                    onClick={() => { action.action(); setIsOpen(false); }}
                                    className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-100 text-neutral-700 transition-colors"
                                >
                                    {action.icon}
                                    <span>{action.name}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Project Results */}
                    {projects.length > 0 && (
                        <div>
                            <h3 className="text-xs font-semibold text-neutral-400 px-3 py-2 uppercase">Projects</h3>
                            {projects.map(project => (
                                <button
                                    key={project._id}
                                    onClick={() => { navigate(`/projects/${project._id}`); setIsOpen(false); }}
                                    className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-100 text-neutral-700 transition-colors group"
                                >
                                    <FileText className="w-4 h-4 text-neutral-400 group-hover:text-primary" />
                                    <span className="truncate">{project.title}</span>
                                    <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-50" />
                                </button>
                            ))}
                        </div>
                    )}

                    {filteredActions.length === 0 && projects.length === 0 && (
                        <div className="text-center py-8 text-neutral-400">
                            No results found.
                        </div>
                    )}
                </div>

                <div className="bg-neutral-50 px-4 py-2 border-t border-neutral-200 flex justify-between items-center text-xs text-neutral-400">
                    <div className="flex gap-2">
                        <span><strong className="font-medium text-neutral-600">↑↓</strong> to navigate</span>
                        <span><strong className="font-medium text-neutral-600">↵</strong> to select</span>
                    </div>
                    <span>CodeBazaar Search</span>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
