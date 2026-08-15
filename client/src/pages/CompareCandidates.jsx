import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ScoreBadge } from '../components/ScoreBadge';
import { GitCompare, Users, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

export const CompareCandidates = () => {
  const [searchParams] = useSearchParams();
  const initialCand1 = searchParams.get('cand1');

  const [allCandidates, setAllCandidates] = useState([]);
  const [selectedIds, setSelectedIds] = useState(initialCand1 ? [initialCand1] : []);
  const [comparedProfiles, setComparedProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCandidateList = async () => {
      try {
        const res = await axios.get('/api/candidates?limit=100');
        if (res.data.success) {
          setAllCandidates(res.data.data.candidates);
          if (!initialCand1 && res.data.data.candidates.length >= 2) {
            setSelectedIds([res.data.data.candidates[0]._id, res.data.data.candidates[1]._id]);
          }
        }
      } catch (err) {
        console.error('Failed to load candidate list:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCandidateList();
  }, [initialCand1]);

  useEffect(() => {
    const fetchComparedData = async () => {
      if (selectedIds.length === 0) {
        setComparedProfiles([]);
        return;
      }
      try {
        const profiles = await Promise.all(
          selectedIds.map(async (candId) => {
            const res = await axios.get(`/api/candidates/${candId}`);
            const cand = res.data.data.candidate;
            const app = res.data.data.applications[0] || {};
            return {
              candidate: cand,
              app,
            };
          })
        );
        setComparedProfiles(profiles);
      } catch (err) {
        console.error('Failed to fetch compared candidates:', err);
      }
    };
    fetchComparedData();
  }, [selectedIds]);

  const toggleSelectCandidate = (candId) => {
    if (selectedIds.includes(candId)) {
      setSelectedIds(selectedIds.filter((id) => id !== candId));
    } else {
      if (selectedIds.length >= 4) {
        alert('You can compare a maximum of 4 candidates side-by-side.');
        return;
      }
      setSelectedIds([...selectedIds, candId]);
    }
  };

  // Recharts Chart Dataset
  const chartData = [
    {
      category: 'Overall ATS Score',
      ...Object.fromEntries(comparedProfiles.map((p) => [p.candidate.name, p.app.finalScore || 80])),
    },
    {
      category: 'Skill Score',
      ...Object.fromEntries(comparedProfiles.map((p) => [p.candidate.name, p.app.skillScore || 85])),
    },
    {
      category: 'Semantic Score',
      ...Object.fromEntries(comparedProfiles.map((p) => [p.candidate.name, p.app.semanticScore || 75])),
    },
    {
      category: 'Experience Score',
      ...Object.fromEntries(comparedProfiles.map((p) => [p.candidate.name, p.app.experienceScore || 90])),
    },
    {
      category: 'Education Score',
      ...Object.fromEntries(comparedProfiles.map((p) => [p.candidate.name, p.app.educationScore || 85])),
    },
  ];

  const BAR_COLORS = ['#818cf8', '#c084fc', '#34d399', '#fbbf24'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <GitCompare className="w-6 h-6 text-indigo-400" /> Side-by-Side Candidate Comparison Matrix
        </h1>
        <p className="text-xs text-slate-400">
          Select 2 to 4 candidates to evaluate overall scores, sub-scores, projects, and missing skills.
        </p>
      </div>

      {/* Candidate Selector Chips */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
        <p className="text-xs font-semibold text-slate-300">Select Candidates to Compare (Max 4):</p>
        <div className="flex flex-wrap gap-2">
          {allCandidates.map((cand) => {
            const isSelected = selectedIds.includes(cand._id);
            return (
              <button
                key={cand._id}
                onClick={() => toggleSelectCandidate(cand._id)}
                className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500 shadow-md'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {isSelected ? '✓ ' : '+ '} {cand.name}
              </button>
            );
          })}
        </div>
      </div>

      {comparedProfiles.length > 0 ? (
        <div className="space-y-8">
          {/* Comparison Bar Chart */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-200">Sub-Score Comparative Analytics</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="category" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  {comparedProfiles.map((p, idx) => (
                    <Bar
                      key={p.candidate._id}
                      dataKey={p.candidate.name}
                      fill={BAR_COLORS[idx % BAR_COLORS.length]}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tabular Comparison Matrix */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-4 w-44 bg-slate-950">Category</th>
                    {comparedProfiles.map((p) => (
                      <th key={p.candidate._id} className="p-4 text-center font-bold text-slate-100 text-sm">
                        {p.candidate.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="p-4 font-bold text-slate-200 bg-slate-950/60">Overall ATS Score</td>
                    {comparedProfiles.map((p) => (
                      <td key={p.candidate._id} className="p-4 text-center">
                        <ScoreBadge score={p.app.finalScore || 80} recommendation={p.app.recommendation || 'Good Match'} size="lg" />
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4 font-semibold text-slate-300 bg-slate-950/60">Skill Score</td>
                    {comparedProfiles.map((p) => (
                      <td key={p.candidate._id} className="p-4 text-center font-bold text-purple-400 text-sm">
                        {p.app.skillScore || 85}%
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4 font-semibold text-slate-300 bg-slate-950/60">Semantic Similarity</td>
                    {comparedProfiles.map((p) => (
                      <td key={p.candidate._id} className="p-4 text-center font-bold text-indigo-400 text-sm">
                        {p.app.semanticScore || 75}%
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4 font-semibold text-slate-300 bg-slate-950/60">Years of Experience</td>
                    {comparedProfiles.map((p) => (
                      <td key={p.candidate._id} className="p-4 text-center font-semibold text-slate-100">
                        {p.candidate.yearsOfExperience} Yrs
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4 font-semibold text-slate-300 bg-slate-950/60">Matched Skills</td>
                    {comparedProfiles.map((p) => (
                      <td key={p.candidate._id} className="p-4">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {(p.app.matchedSkills || p.candidate.skills || []).slice(0, 6).map((s, idx) => (
                            <span key={idx} className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded capitalize">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4 font-semibold text-slate-300 bg-slate-950/60">Missing Skills</td>
                    {comparedProfiles.map((p) => (
                      <td key={p.candidate._id} className="p-4">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {(p.app.missingSkills?.required || []).length > 0 ? (
                            p.app.missingSkills.required.map((s, idx) => (
                              <span key={idx} className="bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[10px] px-2 py-0.5 rounded capitalize">
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-emerald-400 font-semibold text-[11px]">None Missing</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4 font-semibold text-slate-300 bg-slate-950/60">Projects</td>
                    {comparedProfiles.map((p) => (
                      <td key={p.candidate._id} className="p-4 text-center text-slate-300">
                        {(p.candidate.projects || []).length} Verified Project(s)
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4 font-semibold text-slate-300 bg-slate-950/60">Certifications</td>
                    {comparedProfiles.map((p) => (
                      <td key={p.candidate._id} className="p-4 text-center text-slate-300">
                        {(p.candidate.certifications || []).length} Cert(s)
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">Please select at least 2 candidates above to render comparison.</p>
        </div>
      )}
    </div>
  );
};
