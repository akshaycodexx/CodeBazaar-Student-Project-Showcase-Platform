import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin } from 'react-icons/fi';
const API_URL = import.meta.env.VITE_API_URL;

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

function HackathonList() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await fetch(`${API_URL}/api/hackathons`);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        const formattedData = data.map(hack => ({
          ...hack,
          tags: Array.isArray(hack.tags) ? hack.tags : hack.tags?.split(',').map(tag => tag.trim()) || []
        }));
        setHackathons(formattedData);
      } catch (error) {
        console.error('Error fetching hackathons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-neutral-500">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-primary rounded-full animate-spin mb-4"></div>
        <p>Finding awesome hackathons...</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-center text-neutral-900 mb-10">Upcoming Hackathons 🚀</h1>
      {hackathons.length === 0 ? (
        <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-neutral-200">
          <h2 className="text-2xl font-bold text-neutral-700 mb-2">No Hackathons Found</h2>
          <p className="text-neutral-500">Check back later or try creating a new one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hackathons.map((hack) => (
            <Link to={`/hackathons/${hack._id}`} className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-[400px] flex flex-col" key={hack._id}>

              {/* Cover Image Background */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${hack.coverImage})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"></div>

              <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  {hack.logoImage && <img src={hack.logoImage} alt={`${hack.title} Logo`} className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm p-1 object-contain" />}
                  <div className="flex flex-wrap gap-2 justify-end max-w-[60%]">
                    {hack.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto">
                  <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{hack.title}</h3>
                  <p className="text-neutral-300 text-sm line-clamp-2 mb-4">{hack.shortDescription}</p>

                  <div className="flex justify-between items-center pt-4 border-t border-white/20 text-sm font-medium text-white/90">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1"><FiCalendar /> {formatDate(hack.startDate)}</span>
                      <span className="flex items-center gap-1"><FiMapPin /> {hack.location}</span>
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform duration-200">View Details &rarr;</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default HackathonList;