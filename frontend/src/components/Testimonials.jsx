import React from 'react';
import './Testimonials.css';

// ✅ Import images from src/images folder
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
    <section className="testimonials">
      <h2>What Our Users Say</h2>
      <div className="testimonials-container">
        {testimonials.map((t, index) => (
          <div className="testimonial-card" key={index}>
            <div className="testimonial-photo">
              <img src={t.photo} alt={t.name} />
            </div>
            <p className="testimonial-feedback">“{t.feedback}”</p>
            <h4 className="testimonial-name">- {t.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
