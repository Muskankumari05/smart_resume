import React from 'react';

export const ScoreBadge = ({ score, recommendation, size = 'md' }) => {
  let color = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  if (score >= 90 || recommendation === 'Strong Match') {
    color = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (score >= 75 || recommendation === 'Good Match') {
    color = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
  } else if (score >= 60 || recommendation === 'Moderate Match') {
    color = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  }

  const px = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-4 py-1.5 text-base font-bold' : 'px-3 py-1 text-sm font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${px} ${color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {score !== undefined ? `${score}%` : recommendation}
    </span>
  );
};
