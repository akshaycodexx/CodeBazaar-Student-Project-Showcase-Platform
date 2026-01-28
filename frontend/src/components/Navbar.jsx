import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Menu, User, Bell, Moon, Sun, X, LogOut, LayoutDashboard, HelpCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL;

function Navbar({ user, setuser }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/notifications`, { withCredentials: true });
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.read).length);
    } catch (err) { }
  };

  const markRead = async () => {
    if (unreadCount > 0) {
      try {
        await axios.put(`${API_URL}/api/notifications/read`, {}, { withCredentials: true });
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      } catch (err) { }
    }
  };

  const handleLogout = async () => {
    if (!window.confirm("Log out?")) return;
    try {
      await axios.get(`${API_URL}/api/logout`, { withCredentials: true });
      setuser(null);
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

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-2' : 'bg-transparent py-4'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div onClick={() => navigate("/")} className="cursor-pointer flex items-center gap-2">
            <span className="text-2xl font-black gradient-text tracking-tighter">CodeBazaar</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                onClick={() => navigate(link.path)}
                className="text-sm font-medium text-neutral-600 hover:text-indigo-600 cursor-pointer transition-colors relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-neutral-100 transition-colors">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {!user ? (
              <button
                onClick={() => navigate('/signin')}
                className="bg-neutral-900 text-white px-5 py-2 rounded-lg font-bold hover:bg-neutral-800 transition-all hover:scale-105"
              >
                Log In
              </button>
            ) : (
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <div className="relative">
                  <button onClick={() => { setIsNotifOpen(!isNotifOpen); markRead(); }} className="relative p-2 hover:bg-neutral-100 rounded-full transition-colors">
                    <Bell className="w-5 h-5 text-neutral-600" />
                    {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                  </button>
                  <AnimatePresence>
                    {isNotifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-neutral-100 overflow-hidden"
                      >
                        <div className="p-4 border-b border-neutral-100 font-bold text-sm">Notifications</div>
                        <div className="max-h-64 overflow-y-auto">
                          {notifications.length === 0 ? <p className="p-4 text-center text-xs text-neutral-400">No updates</p> :
                            notifications.map(n => (
                              <div key={n._id} className={`p-3 border-b border-neutral-50 text-sm hover:bg-neutral-50 ${!n.read ? 'bg-indigo-50/30' : ''}`}>
                                {n.message}
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
                    className="w-10 h-10 rounded-full border-2 border-white shadow-md cursor-pointer hover:border-indigo-500 transition-all"
                    alt="Profile"
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-neutral-100 py-2 hidden group-hover:block transition-all transform origin-top-right">
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="font-bold text-neutral-900 truncate">{user.fullName}</p>
                      <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                    </div>
                    <a onClick={() => navigate('/dashboard')} className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 cursor-pointer"><LayoutDashboard className="w-4 h-4" /> Dashboard</a>
                    <a onClick={() => navigate(`/profile/${user._id}`)} className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 cursor-pointer"><User className="w-4 h-4" /> Profile</a>
                    <a onClick={() => navigate('/help')} className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 cursor-pointer"><HelpCircle className="w-4 h-4" /> Help</a>
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"><LogOut className="w-4 h-4" /> Logout</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-neutral-600">
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
            className="md:hidden bg-white border-t border-neutral-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  onClick={() => { navigate(link.path); setIsMenuOpen(false); }}
                  className="block text-lg font-medium text-neutral-800 hover:text-indigo-600"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <button onClick={toggleTheme} className="flex items-center gap-2 text-neutral-600">
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
