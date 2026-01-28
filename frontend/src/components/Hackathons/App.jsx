import React from 'react';
import Hero from './Hero';
import HackathonList from './HackathonList';
import Stats from './Stats';
import Footer from './Footer';
import Features from '../Features';
import CreateHackathonBox from './CreateHackathonBox';

function App() {
  return (
    <div className="min-h-screen bg-neutral-50 overflow-x-hidden">
      <Hero />
      <Features />
      <CreateHackathonBox />
      <div className="max-w-screen-xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 w-full">
          <HackathonList />
        </div>
        <div className="w-full md:w-80 shrink-0">
          <Stats />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;