import React from 'react';
import heroImage from '../../assets/hero1.png';

export default function Hero() {
  return (
    <section className="bg-white py-12 px-4 md:px-12 border-b border-neutral-100">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 mb-6">Hackathons</h1>
          <p className="text-lg text-neutral-600 mb-8 leading-relaxed max-w-xl">
            Join our interactive hackathons and earn money by uploading projects for challenges.
          </p>
          <button className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors">
            Browse Competitions
          </button>
        </div>
        <div className="flex-1 flex justify-center md:justify-end">
          <img className="max-w-full md:max-w-md h-auto object-contain" src={heroImage} alt="Hero" />
        </div>
      </div>
    </section>
  );
}
