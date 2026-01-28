import React from "react";
import HeroSection from "./components/HeroSection";
import Features from "./components/Features";
import ProjectsShowcase from "./components/ProjectsShowcase";
import Tutorials from "./components/Tutorials";
import PlanSection from "./components/PlanSection";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";

function MainPage({ tutorials, setTutorials, user, fetchTutorials }) {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
      <HeroSection />
      <Features />
      <ProjectsShowcase />
      <Tutorials tutorials={tutorials} setTutorials={setTutorials} user={user} />
      <PlanSection />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default MainPage;
