import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Header from './Header';
import Hero from './Hero';
// import Features from './Features';
import HackathonList from './HackathonList';
import Stats from './Stats';
import Footer from './Footer';
import Features from '../Features';
import CreateHackathonBox from './CreateHackathonBox';
import HackathonDetail from './HackathonDetail';

import './Hero.css';
import './HackathonList.css';
import './Stats.css';
import './Footer.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* <Header /> */}
                <Hero />
                {/* <Features /> */}
                <Features />
                <CreateHackathonBox />
                <div className="main-content hackathon-stats-section">
                  <HackathonList />
                  <Stats />
                </div>
                <Footer />
              </>
            }
          />

          {/* ✅ New Route */}
          <Route path="/hackathons/:id" element={<HackathonDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
