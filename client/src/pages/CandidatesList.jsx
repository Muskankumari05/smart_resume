import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Users, Search, Filter, Mail, MapPin, Briefcase, Trash2, ArrowRight } from 'lucide-react';

export const CandidatesList = () => {
  const [candidates, setCandidates] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [skill, setSkill] = useState('');
  const [minExp, setMinExp] = useState('');
  const [page, setPage] = useState(1);

  const fetchCandidates = async () => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      if (search) params.append('search', search);
      if (skill) params.append('skill', skill);
      if (minExp) params.append('minExp', minExp);

      const res = await axios.get(`/api/candidates?${params.toString()}`);
      if (res.data.success) {
        setCandidates(res.data.data.candidates);
        setPagination(res.data.data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [page, search, skill, minExp]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete candidate profile from database?')) return;
    try {
      await axios.delete(`/api/candidates/${id}`);
      fetchCandidates();
    } catch (err) {
      alert('Failed to delete candidate');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            Candidate Database Directory
          </h1>
          <p className="text-xs text-slate-400">
            Browse, search, and manage candidate profiles extracted from uploaded resumes
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate name, email, location..."
            className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl py-2 pl-10 pr-4 outline-none focus:border-indigo-500"
          />
        </div>

        <input
          type="text"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          placeholder="Filter by skill (e.g. react)"
          className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-500"
        />

        <select
          value={minExp}
          onChange={(e) => setMinExp(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 outline-none"
        >
          <option value="">All Experience</option>
          <option value="1">1+ Years Exp</option>
          <option value="3">3+ Years Exp</option>
          <option value="5">5+ Years Exp</option>
        </select>
      </div>

      {/* Candidates Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : candidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((cand) => (
            <div
              key={cand._id}
              className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between hover:border-purple-500/40 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold flex items-center justify-center">
                      {cand.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                        {cand.name}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" /> {cand.location || 'Remote'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(cand._id, e)}
                    className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed italic">
                  "{cand.summary || 'Extracted candidate profile.'}"
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                  <span>Experience: <strong className="text-slate-200">{cand.yearsOfExperience || 0} Yrs</strong></span>
                  <span>•</span>
                  <span>Skills: <strong className="text-purple-400">{(cand.skills || []).length}</strong></span>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1">
                  {(cand.skills || []).slice(0, 5).map((s, idx) => (
                    <span key={idx} className="bg-slate-800 text-slate-300 text-[11px] px-2 py-0.5 rounded capitalize">
                      {s}
                    </span>
                  ))}
                  {(cand.skills || []).length > 5 && (
                    <span className="text-[11px] text-slate-500 font-semibold self-center">
                      +{(cand.skills || []).length - 5} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {cand.email || 'No email provided'}
                </span>
                <Link
                  to={`/candidates/${cand._id}`}
                  className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  View Profile <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center space-y-3">
          <Users className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-200">No Candidates Found</h3>
          <p className="text-xs text-slate-400">
            No candidates match your current filter parameters or search queries.
          </p>
        </div>
      )}
    </div>
  );
};
