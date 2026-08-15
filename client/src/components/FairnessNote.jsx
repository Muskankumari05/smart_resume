import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const FairnessNote = () => {
  return (
    <div className="rounded-xl border border-indigo-900/40 bg-indigo-950/20 p-4 text-xs text-indigo-200/80 flex items-start gap-3 mt-8">
      <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="font-semibold text-indigo-200 flex items-center gap-1.5">
          Responsible AI & Fair Hiring Commitment
        </p>
        <p className="leading-relaxed">
          Candidate ranking algorithms evaluate solely job-relevant qualifications, technical skills, verified experience, and keyword relevance.
          Personal protected characteristics (gender, age, race, religion, nationality, marital status) are strictly excluded from ranking calculations.
          AI recommendations are designed to assist human recruiters and must not serve as the sole basis for hiring decisions.
        </p>
      </div>
    </div>
  );
};
