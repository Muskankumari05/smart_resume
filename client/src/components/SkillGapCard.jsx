import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, Sparkles } from 'lucide-react';

export const SkillGapCard = ({ matchedSkills = [], missingSkills = {} }) => {
  const reqMissing = missingSkills?.required || [];
  const prefMissing = missingSkills?.preferred || [];
  const additional = missingSkills?.additional || [];

  return (
    <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h4 className="text-base font-semibold text-slate-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Skill Gap Analysis
        </h4>
        <span className="text-xs text-slate-400">
          {matchedSkills.length} Matched / {reqMissing.length} Missing Required
        </span>
      </div>

      {/* Matched Skills */}
      <div>
        <h5 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> Matched Skills ({matchedSkills.length})
        </h5>
        {matchedSkills.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {matchedSkills.map((s, idx) => (
              <span key={idx} className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-md font-medium capitalize">
                {s}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No matching skills found.</p>
        )}
      </div>

      {/* Missing Required Skills */}
      <div>
        <h5 className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <XCircle className="w-3.5 h-3.5" /> Missing Required Skills ({reqMissing.length})
        </h5>
        {reqMissing.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {reqMissing.map((s, idx) => (
              <span key={idx} className="bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs px-2.5 py-1 rounded-md font-medium capitalize">
                {s}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> All required skills satisfied!
          </p>
        )}
      </div>

      {/* Missing Preferred Skills */}
      {prefMissing.length > 0 && (
        <div>
          <h5 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> Missing Preferred Skills ({prefMissing.length})
          </h5>
          <div className="flex flex-wrap gap-1.5">
            {prefMissing.map((s, idx) => (
              <span key={idx} className="bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs px-2.5 py-1 rounded-md capitalize">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Additional Skills */}
      {additional.length > 0 && (
        <div>
          <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Additional Bonus Skills ({additional.length})
          </h5>
          <div className="flex flex-wrap gap-1.5">
            {additional.slice(0, 8).map((s, idx) => (
              <span key={idx} className="bg-slate-800 text-slate-300 border border-slate-700 text-xs px-2.5 py-1 rounded-md capitalize">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
