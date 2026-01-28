import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

function PlanSection() {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/api/plans`)
      .then(res => setPlans(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-neutral-900 mb-10">Choose Your Plan</h2>

        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto">
          {plans.length === 0 ? <p>Loading Plans...</p> : plans.map(plan => (
            <div key={plan._id} className={`flex-1 rounded-2xl shadow-sm border p-8 hover:shadow-xl transition-all duration-300 relative overflow-hidden ${plan.recommended ? 'bg-gradient-to-br from-indigo-600 to-indigo-800 text-white transform md:-translate-y-4 shadow-xl' : 'bg-white border-neutral-200 text-neutral-800'}`}>
              {plan.recommended && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
              )}
              <h3 className={`text-2xl font-bold mb-4 ${plan.recommended ? 'text-white' : 'text-neutral-800'}`}>{plan.name}</h3>
              <div className={`text-4xl font-extrabold mb-6 ${plan.recommended ? 'text-white' : 'text-neutral-900'}`}>
                ₹{plan.price}<span className={`text-lg font-normal ${plan.recommended ? 'text-indigo-200' : 'text-neutral-500'}`}>/{plan.duration}</span>
              </div>
              <ul className={`space-y-3 mb-8 text-left ${plan.recommended ? 'text-indigo-100' : 'text-neutral-600'}`}>
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <svg className={`w-5 h-5 mr-2 ${plan.recommended ? 'text-green-400' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/pricing')}
                className={`w-full py-3 px-6 font-bold rounded-xl transition-colors ${plan.recommended ? 'bg-white text-indigo-700 hover:bg-neutral-50 shadow-lg' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'}`}
              >
                {plan.buttonText || "Get Started"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PlanSection;
