import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Menu, User, Bell, Moon, Sun, X, LogOut, LayoutDashboard, HelpCircle, Briefcase, Trophy, ShoppingCart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSocket } from '../context/SocketContextValue';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL;

function Navbar({ user, setuser }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Socket Data
  const { unreadCount, notifications, markRead } = useSocket() || { unreadCount: 0, notifications: [], markRead: () => { } };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    if (!window.confirm("Log out?")) return;
    try {
      await axios.get(`${API_URL}/api/signout`, { withCredentials: true });
      setuser(null);
      localStorage.removeItem("user");
      navigate('/');
      setIsMenuOpen(false);
    } catch (e) { console.error(e); }
  };

  const navLinks = [
    { name: 'Projects', path: '/getallprojects' },
    { name: 'Hackathons', path: '/hack' },
    { name: 'Mentorship', path: '/mentorship' },
    { name: 'Jobs', path: '/jobs' },
    { name: 'Interviews', path: '/interviews' },
    { name: 'Recruiters', path: '/recruiters' },
    { name: 'Leaderboard', path: '/leaderboard' },
  ];

  const handleNotifClick = (link) => {
    markRead();
    setIsNotifOpen(false);
    if (link) navigate(link);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-2 shadow-sm bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md' : 'bg-transparent py-4'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div onClick={() => navigate("/")} className="cursor-pointer flex items-center gap-2">
            <span className="text-2xl font-black gradient-text tracking-tighter text-indigo-600 dark:text-indigo-400">CodeBazaar</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                onClick={() => navigate(link.path)}
                className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-300">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {!user ? (
              <button
                onClick={() => navigate('/signin')}
                className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-5 py-2 rounded-lg font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all hover:scale-105"
              >
                Log In
              </button>
            ) : (
              <div className="flex items-center gap-4">
                {/* Cart */}
                <button onClick={() => navigate('/cart')} className="relative p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-neutral-600 dark:text-neutral-300">
                  <ShoppingCart className="w-5 h-5" />
                  {user.cart?.length > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">{user.cart.length}</span>}
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button onClick={() => { setIsNotifOpen(!isNotifOpen); if (!isNotifOpen && unreadCount > 0) markRead(); }} className="relative p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-neutral-600 dark:text-neutral-300">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-pulse border-2 border-white dark:border-neutral-900">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <AnimatePresence>
                    {isNotifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-800 rounded-xl shadow-2xl border border-neutral-100 dark:border-neutral-700 overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-neutral-100 dark:border-neutral-700 flex justify-between items-center">
                          <span className="font-bold text-sm text-neutral-900 dark:text-white">Notifications</span>
                          <button onClick={markRead} className="text-xs text-indigo-600 hover:underline">Mark all read</button>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? <p className="p-8 text-center text-xs text-neutral-400">No new updates</p> :
                            notifications.map((n, i) => (
                              <div
                                key={i}
                                onClick={() => handleNotifClick(n.link)}
                                className={`p-4 border-b border-neutral-50 dark:border-neutral-700 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700/50 cursor-pointer transition-colors ${!n.read ? 'bg-indigo-50/50 dark:bg-indigo-900/20 shadow-inner' : ''}`}
                              >
                                <p className="text-neutral-800 dark:text-neutral-200">{n.message}</p>
                                <p className="text-xs text-neutral-400 mt-1">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                            ))
                          }
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile */}
                <div className="relative group">
                  <img
                    src={user.profilePicture || "https://ui-avatars.com/api/?name=" + user.fullName}
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-neutral-800 shadow-md cursor-pointer hover:border-indigo-500 transition-all object-cover"
                    alt="Profile"
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-800 rounded-xl shadow-2xl border border-neutral-100 dark:border-neutral-700 py-2 hidden group-hover:block transition-all transform origin-top-right z-50 animate-scale-up">
                    <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-700">
                      <p className="font-bold text-neutral-900 dark:text-white truncate">{user.fullName}</p>
                      <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                    </div>
                    <a onClick={() => navigate('/dashboard')} className="flex items-center gap-2 px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 cursor-pointer"><LayoutDashboard className="w-4 h-4" /> Dashboard</a>
                    <a onClick={() => navigate(`/profile/${user._id}`)} className="flex items-center gap-2 px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 cursor-pointer"><User className="w-4 h-4" /> Profile</a>
                    {user.role === 'recruiter' && (
                      <a onClick={() => navigate('/recruiters')} className="flex items-center gap-2 px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 cursor-pointer"><Briefcase className="w-4 h-4" /> Hiring</a>
                    )}
                    <div className="h-px bg-neutral-100 dark:bg-neutral-700 my-1"></div>
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 cursor-pointer"><LogOut className="w-4 h-4" /> Logout</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-neutral-600 dark:text-neutral-300">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  onClick={() => { navigate(link.path); setIsMenuOpen(false); }}
                  className="block text-lg font-medium text-neutral-800 dark:text-white hover:text-indigo-600"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <button onClick={toggleTheme} className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                  {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />} Theme
                </button>
                {!user ? (
                  <button onClick={() => { navigate('/signin'); setIsMenuOpen(false); }} className="text-indigo-600 font-bold">Log In</button>
                ) : (
                  <button onClick={handleLogout} className="text-red-600 font-bold">Logout</button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
