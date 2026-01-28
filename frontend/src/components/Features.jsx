import React from 'react';
import plcp from '../assets/plcp.png';
import em from '../assets/em.png';
import pm from '../assets/pm.png';

function Features() {
  const features = [
    {
      title: 'Upload Coding Projects',
      description: 'Share your work with the world.',
      image: plcp,
    },
    {
      title: 'Earn Money',
      description: 'Monetize your best projects.',
      image: em,
    },
    {
      title: 'Get a Premium Membership',
      description: 'Unlock exclusive features.',
      image: pm,
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              className="bg-neutral-50 p-8 rounded-xl text-center shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-2 border border-neutral-100"
              key={index}
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-indigo-50 flex items-center justify-center overflow-hidden">
                <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">{feature.title}</h3>
              <p className="text-neutral-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
