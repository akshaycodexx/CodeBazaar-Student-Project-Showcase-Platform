import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Menu, User, Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL;

function Navbar({ user, setuser }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/notifications`, { withCredentials: true });
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.read).length);
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  const markRead = async () => {
    if (unreadCount > 0) {
      try {
        await axios.put(`${API_URL}/api/notifications/read`, {}, { withCredentials: true });
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      } catch (err) {
        console.error("Failed to mark read");
      }
    }
  };

  const handleLoginClick = () => {
    navigate('/signin');
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    try {
      await axios.get(`${API_URL}/api/logout`, { withCredentials: true });
      setuser(null);
      navigate('/');
      alert("Logout Successfully!!");
      setIsMenuOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinks = [
    { name: 'Projects', path: '/getallprojects' },
    { name: 'Hackathons', path: '/hack' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Mentorship', path: '/mentorship' },
    { name: 'Mentorship', path: '/mentorship' },
    { name: 'Jobs', path: '/jobs' },
    { name: 'Mock Interview', path: '/interviews' },
    { name: 'Recruiters Panel', path: '/recruiters' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Cart', path: '/cart' },
  ];

  return (
    <nav className="fixed w-full z-50 top-0 start-0 border-b border-white/20 glass-effect">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a onClick={() => navigate("/")} className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer">
          <span className="self-center text-2xl font-bold whitespace-nowrap text-primary-dark font-heading">CodeBazaar</span>
        </a>

        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse items-center gap-4">
          {!user ? (
            <button
              onClick={handleLoginClick}
              type="button"
              className="text-white bg-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary-light font-medium rounded-lg text-sm px-4 py-2 text-center transition-colors duration-200"
            >
              Log in / Signup
            </button>
          ) : (
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button onClick={toggleTheme} className="p-2 text-neutral-600 hover:text-primary transition-colors focus:outline-none">
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => { setIsNotifOpen(!isNotifOpen); markRead(); }}
                  className="relative p-2 text-neutral-600 hover:text-primary transition-colors focus:outline-none"
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-neutral-100 py-2 z-50 animate-fade-in-down h-80 overflow-y-auto">
                    <div className="px-4 py-2 border-b border-neutral-100 font-bold text-neutral-800">Notifications</div>
                    {notifications.length === 0 ? (
                      <p className="px-4 py-4 text-center text-sm text-neutral-500">No new notifications</p>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif._id} className={`px-4 py-3 border-b border-neutral-50 hover:bg-neutral-50 transition-colors ${!notif.read ? 'bg-indigo-50/50' : ''}`}>
                          <p className="text-sm text-neutral-800 font-medium">{notif.message}</p>
                          <p className="text-xs text-neutral-400 mt-1">{new Date(notif.createdAt).toLocaleDateString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-3 focus:outline-none">
                  <img
                    src={user.profilePicture || "/default-avatar.png"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-primary group-hover:border-primary-dark transition-colors"
                  />
                  <span className="hidden md:block text-sm font-medium text-neutral-800">{user.fullName}</span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-100 py-2 hidden group-hover:block hover:block z-50 animate-fade-in-down">
                  <div className="px-4 py-3 border-b border-neutral-100">
                    <p className="text-sm text-neutral-900 font-bold truncate">{user.fullName}</p>
                    <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                  </div>
                  <a onClick={() => navigate('/dashboard')} className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 cursor-pointer">Dashboard</a>
                  <a onClick={() => navigate(`/profile/${user._id}`)} className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 cursor-pointer">My Profile</a>
                  <a onClick={() => navigate('/help')} className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 cursor-pointer">Help & Support</a>
                  <div className="border-t border-neutral-100 mt-1">
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">Logout</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-neutral-500 rounded-lg md:hidden hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-200"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>

        <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMenuOpen ? 'block' : 'hidden'}`} id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-neutral-100 rounded-lg bg-neutral-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  onClick={() => {
                    if (link.path !== '#') navigate(link.path);
                    setIsMenuOpen(false);
                  }}
                  className="block py-2 px-3 text-neutral-900 rounded hover:bg-neutral-100 md:hover:bg-transparent md:hover:text-primary md:p-0 cursor-pointer transition-colors duration-200"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
