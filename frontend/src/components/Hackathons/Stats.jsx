import React from 'react';

export default function Stats() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
      <h2 className="text-xl font-bold text-neutral-900 mb-6 border-b border-neutral-100 pb-2">Hackathon Stats</h2>
      <div className="space-y-4 mb-8">
        <p className="flex justify-between items-center text-neutral-700"><span>Competitions</span> <strong className="text-primary text-xl">25</strong></p>
        <p className="flex justify-between items-center text-neutral-700"><span>Participants</span> <strong className="text-primary text-xl">88</strong></p>
        <p className="flex justify-between items-center text-neutral-700"><span>Submissions</span> <strong className="text-primary text-xl">385</strong></p>
      </div>

      <h3 className="text-lg font-bold text-neutral-900 mb-4">Top Participant</h3>
      <div className="bg-neutral-50 p-4 rounded-xl flex gap-4 items-start border border-neutral-100">
        <div className="w-12 h-12 bg-neutral-200 rounded-full shrink-0"></div>
        <div>
          <strong className="block text-neutral-900 font-semibold mb-1">Sheha R:</strong>
          <p className="text-sm text-neutral-500 italic">"CodeBazaar has demystified student backs and helped me figure out how data works."</p>
        </div>
      </div>
    </div>
  );
}
