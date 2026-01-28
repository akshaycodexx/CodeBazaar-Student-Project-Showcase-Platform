import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiCalendar, FiMapPin, FiAward, FiUsers } from "react-icons/fi";
const API_URL = import.meta.env.VITE_API_URL;

function HackathonDetail() {
  const { id } = useParams();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setHackathon(null);
    setLoading(true);
    setError(null);

    const fetchHackathon = async () => {
      try {
        const res = await fetch(`${API_URL}/api/hackathons/${id}`);
        if (!res.ok) {
          throw new Error("Hackathon not found (404)");
        }
        const data = await res.json();
        setHackathon(data);
      } catch (err) {
        console.error("Error fetching hackathon:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathon();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-neutral-500">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-primary rounded-full animate-spin mb-4"></div>
        <p>Loading Hackathon Details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <h2 className="text-3xl font-bold text-neutral-900 mb-2">Oops! Hackathon Not Found</h2>
        <p className="text-neutral-500 mb-6">We couldn't find the hackathon you were looking for.</p>
        <Link to="/" className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors">
          &larr; Back to All Hackathons
        </Link>
      </div>
    );
  }

  if (!hackathon) return null;

  const {
    title = "Untitled Hackathon",
    description = "No description available.",
    coverImage,
    startDate,
    endDate,
    location = "Online",
    prizes = "To be announced",
    registrationLink = "#",
    teamSizeMin = 1,
    teamSizeMax = 5,
  } = hackathon;

  return (
    <div className="min-h-screen bg-neutral-50 pb-16">
      {/* Hero Header */}
      <header className="relative h-[55vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${coverImage})` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-lg">{title}</h1>
          <p className="text-xl md:text-2xl font-light text-gray-200 mb-8">The ultimate innovation challenge awaits.</p>
          <a href={registrationLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:-translate-y-1 transition-all duration-300">
            Register Now
          </a>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 -mt-16 relative z-20 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        {/* Main Content */}
        <main className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 animate-fade-in-up delay-100">
          <section className="mb-10 last:mb-0">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4 pb-2 border-b border-neutral-100">About this Hackathon</h2>
            <p className="text-neutral-600 leading-relaxed whitespace-pre-wrap">{description}</p>
          </section>

          <section className="mb-10 last:mb-0">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4 pb-2 border-b border-neutral-100 flex items-center gap-2"><FiAward className="text-primary" /> Prizes & Rewards</h2>
            <p className="text-neutral-600 leading-relaxed whitespace-pre-wrap">{prizes}</p>
          </section>
        </main>

        {/* Sidebar */}
        <aside className="space-y-6 animate-fade-in-up delay-200 lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-neutral-100">
            <h3 className="text-lg font-bold text-center text-neutral-900 mb-6">Hackathon Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <FiCalendar className="text-primary text-xl mt-1 shrink-0" />
                <div>
                  <strong className="block text-neutral-800 text-sm font-semibold">Dates</strong>
                  <span className="text-neutral-600 text-sm">
                    {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <FiMapPin className="text-primary text-xl mt-1 shrink-0" />
                <div>
                  <strong className="block text-neutral-800 text-sm font-semibold">Location</strong>
                  <span className="text-neutral-600 text-sm">{location}</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <FiUsers className="text-primary text-xl mt-1 shrink-0" />
                <div>
                  <strong className="block text-neutral-800 text-sm font-semibold">Team Size</strong>
                  <span className="text-neutral-600 text-sm">{teamSizeMin} - {teamSizeMax} members</span>
                </div>
              </li>
            </ul>
            <a href={registrationLink} target="_blank" rel="noopener noreferrer" className="block w-full bg-primary hover:bg-primary-dark text-white font-bold text-center py-3 rounded-lg mt-6 shadow-md transition-colors">
              Join The Challenge
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default HackathonDetail;