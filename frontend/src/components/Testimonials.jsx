import React from 'react';
import img1 from '../images/Anubhaw.jpg';
import img2 from '../images/AkshayKumarMandal_Stream_Casual.jpg';
import img3 from '../images/saheb.jpg';

function Testimonials() {
  const testimonials = [
    {
      name: 'Anubhaw Gupta',
      feedback: 'Uploading my projects helped me land an internship!',
      photo: img1,
    },
    {
      name: 'Akshay Kumar Mandal',
      feedback: 'The premium plan gave my projects so much visibility!',
      photo: img2,
    },
    {
      name: 'Saheb Answari',
      feedback: 'I love how simple and effective this platform is.',
      photo: img3,
    },
  ];

  return (
    <section className="py-16 bg-neutral-50">
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-neutral-900 mb-10">What Our Users Say</h2>

        <div className="flex flex-wrap justify-center gap-8">
          {testimonials.map((t, index) => (
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 w-full max-w-sm flex flex-col items-center border border-neutral-100" key={index}>
              <div className="w-20 h-20 mb-6 rounded-full overflow-hidden border-4 border-indigo-50 shadow-sm">
                <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-neutral-600 italic text-lg leading-relaxed mb-6">“{t.feedback}”</p>
              <h4 className="text-neutral-900 font-bold text-base">- {t.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
