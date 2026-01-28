import React from 'react';
import UploadSection from './UploadSection';
import FilterBar from './FilterBar';
import ProjectList from './ProjectList';
import Footer from '../Footer';

function App() {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      <UploadSection />
      <FilterBar />
      <ProjectList />
      <Footer />
    </div>
  );
}

export default App;