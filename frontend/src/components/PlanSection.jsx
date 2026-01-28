import React from 'react';

function PlanSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-neutral-900 mb-10">Choose Your Plan</h2>

        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold text-neutral-800 mb-4">Free Plan</h3>
            <div className="text-4xl font-extrabold text-neutral-900 mb-6">₹0<span className="text-lg font-normal text-neutral-500">/mo</span></div>
            <ul className="space-y-3 mb-8 text-neutral-600 text-left">
              <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Upload Projects</li>
              <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Community Support</li>
              <li className="flex items-center text-neutral-400"><svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>Revenue Share</li>
            </ul>
            <button className="w-full py-3 px-6 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold rounded-xl transition-colors">Start for Free</button>
          </div>

          {/* Premium Plan */}
          <div className="flex-1 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl shadow-xl p-8 transform md:-translate-y-4 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
            <h3 className="text-2xl font-bold mb-4 text-white">Premium Plan</h3>
            <div className="text-4xl font-extrabold mb-6">₹499<span className="text-lg font-normal text-indigo-200">/year</span></div>
            <ul className="space-y-3 mb-8 text-indigo-100 text-left">
              <li className="flex items-center"><svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Unlimited Uploads</li>
              <li className="flex items-center"><svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Featured Listing</li>
              <li className="flex items-center"><svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Earn Revenue</li>
            </ul>
            <button className="w-full py-3 px-6 bg-white hover:bg-neutral-50 text-indigo-700 font-bold rounded-xl transition-colors shadow-lg">Upgrade Now</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PlanSection;
