import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Menu, X, User } from 'lucide-react'; // Assuming lucide-react is available or use react-icons if preferred

const API_URL = import.meta.env.VITE_API_URL;

function Navbar({ user, setuser }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    { name: 'Recruiters Panel', path: '/recruiters' },
  ];

  return (
    <nav className="fixed w-full z-50 top-0 start-0 border-b border-white/20 glass-effect">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a onClick={() => navigate("/")} className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer">
          <span className="self-center text-2xl font-bold whitespace-nowrap text-primary-dark font-heading">CodeBazaar</span>
        </a>

        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {!user ? (
            <button
              onClick={handleLoginClick}
              type="button"
              className="text-white bg-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary-light font-medium rounded-lg text-sm px-4 py-2 text-center transition-colors duration-200"
            >
              Log in / Signup
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <img
                src={user.profilePicture || "/default-avatar.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-primary"
              />
              <span className="hidden md:block text-sm font-medium text-neutral-800">{user.fullName}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Logout
              </button>
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
