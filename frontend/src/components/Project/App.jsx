import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UploadSection from './UploadSection';
import FilterBar from './FilterBar';
import ProjectList from './ProjectList';
import Footer from '../Footer';

const API_URL = import.meta.env.VITE_API_URL;

function App({ user }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    tag: '',
    sort: ''
  });

  // Debounce search to prevent too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects();
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.tag) params.append('tag', filters.tag);
      if (filters.sort) params.append('sort', filters.sort);

      const res = await axios.get(`${API_URL}/api/projects/getallprojects?${params.toString()}`, {
        withCredentials: true
      });

      // Handle both paginated and non-paginated responses for backward compatibility if needed
      setProjects(res.data.projects || res.data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      <UploadSection />
      <FilterBar filters={filters} setFilters={setFilters} />
      <ProjectList
        projects={projects}
        loading={loading}
        user={user}
        clearFilters={() => setFilters({ search: '', tag: '', sort: '' })}
      />
      <Footer />
    </div>
  );
}

export default App;