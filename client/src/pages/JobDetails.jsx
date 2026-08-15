import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ScoreBadge } from '../components/ScoreBadge';
import { BulkUploadModal } from '../components/BulkUploadModal';
import {
  Briefcase,
  Users,
  UploadCloud,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  Award,
  FileText,
  UserCheck,
  UserX,
} from 'lucide-react';

export const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [screening, setScreening] = useState(false);

  // Filters
  const [minScore, setMinScore] = useState('');
  const [sortOption, setSortOption] = useState('highest');

  const fetchJobDetails = async () => {
    try {
      const res = await axios.get(`/api/jobs/${id}`);
      if (res.data.success) {
        setJob(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch job:', err);
    }
  };

  const fetchRankings = async () => {
    try {
      const params = new URLSearchParams();
      if (minScore) params.append('minScore', minScore);
      if (sortOption) params.append('sort', sortOption);

      const res = await axios.get(`/api/ranking/${id}?${params.toString()}`);
      if (res.data.success) {
        setApplications(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch rankings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
    fetchRankings();
  }, [id, minScore, sortOption]);

  const handleScreenAll = async () => {
    setScreening(true);
    try {
      const res = await axios.post(`/api/screening/${id}/screen-all`);
      if (res.data.success) {
        setApplications(res.data.data);
        fetchJobDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to screen candidates.');
    } finally {
      setScreening(false);
    }
  };

  const handleStatusChange = async (appId, status) => {
    try {
      await axios.patch(`/api/screening/status/${appId}`, { status });
      fetchRankings();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading || !job) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">
                {job.company}
              </span>
              <span className="text-xs text-slate-400">• {job.location}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-100 mt-1">{job.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" /> Upload Resumes
            </button>
            <button
              onClick={handleScreenAll}
              disabled={screening}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              {screening ? 'Screening...' : 'Screen All Candidates'}
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <p className="text-[11px] text-slate-400">Total Applicants</p>
            <p className="text-xl font-bold text-slate-100">{job.applicantCount || 0}</p>
          </div>
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <p className="text-[11px] text-slate-400">Average ATS Score</p>
            <p className="text-xl font-bold text-amber-400">{job.avgScore || 0}%</p>
          </div>
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <p className="text-[11px] text-slate-400">Experience Req.</p>
            <p className="text-xl font-bold text-slate-100">{job.experienceRequired}+ Yrs</p>
          </div>
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <p className="text-[11px] text-slate-400">Req. Skills Count</p>
            <p className="text-xl font-bold text-indigo-400">{(job.requiredSkills || []).length}</p>
          </div>
        </div>

        {/* Requirements Badges */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Extracted Required Skills</h4>
          <div className="flex flex-wrap gap-1.5">
            {(job.requiredSkills || []).map((skill, idx) => (
              <span key={idx} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs px-2.5 py-1 rounded-lg font-medium capitalize">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Candidate Ranking Leaderboard Header & Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              Candidate ATS Ranking Leaderboard
            </h2>
            <p className="text-xs text-slate-400">
              Automated rank sorting by calculated multi-criteria final score
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 outline-none"
            >
              <option value="highest">Highest Score First</option>
              <option value="lowest">Lowest Score First</option>
              <option value="semantic">Best Semantic Match</option>
              <option value="skill">Best Skill Match</option>
              <option value="experience">Most Experience</option>
            </select>

            <select
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 outline-none"
            >
              <option value="">All Scores</option>
              <option value="90">90%+ Strong Matches</option>
              <option value="75">75%+ Good Matches</option>
              <option value="60">60%+ Moderate Matches</option>
            </select>
          </div>
        </div>

        {/* Candidate Leaderboard Table */}
        {applications.length > 0 ? (
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Rank</th>
                    <th className="p-4">Candidate</th>
                    <th className="p-4 text-center">ATS Final Score</th>
                    <th className="p-4 text-center">Semantic</th>
                    <th className="p-4 text-center">Skills</th>
                    <th className="p-4 text-center">Experience</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 font-bold text-slate-100">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                          app.rank === 1
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : app.rank === 2
                            ? 'bg-slate-400/20 text-slate-200 border border-slate-400/30'
                            : app.rank === 3
                            ? 'bg-amber-700/20 text-amber-500 border border-amber-700/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          #{app.rank}
                        </span>
                      </td>

                      <td className="p-4">
                        <Link to={`/candidates/${app.candidate?._id}`} className="font-bold text-slate-100 hover:text-indigo-400 block text-sm">
                          {app.candidate?.name}
                        </Link>
                        <span className="text-slate-500 text-[11px]">
                          {app.candidate?.email} • {app.candidate?.yearsOfExperience || 0} yrs exp
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <ScoreBadge score={app.finalScore} recommendation={app.recommendation} />
                      </td>

                      <td className="p-4 text-center font-semibold text-slate-300">
                        {app.semanticScore}%
                      </td>

                      <td className="p-4 text-center font-semibold text-indigo-400">
                        {app.skillScore}%
                      </td>

                      <td className="p-4 text-center font-semibold text-slate-300">
                        {app.experienceScore}%
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStatusChange(app._id, 'shortlisted')}
                            className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                              app.status === 'shortlisted'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-slate-900 text-slate-400 hover:text-emerald-400'
                            }`}
                          >
                            Shortlist
                          </button>
                          <button
                            onClick={() => handleStatusChange(app._id, 'rejected')}
                            className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                              app.status === 'rejected'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-slate-900 text-slate-400 hover:text-rose-400'
                            }`}
                          >
                            Reject
                          </button>
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <Link
                          to={`/candidates/${app.candidate?._id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                        >
                          Details <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center space-y-3">
            <Users className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No candidates screened for this job position yet.</p>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-semibold text-xs"
            >
              <UploadCloud className="w-4 h-4" /> Upload Resumes Now
            </button>
          </div>
        )}
      </div>

      <BulkUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        jobId={id}
        onUploadComplete={() => {
          fetchJobDetails();
          fetchRankings();
        }}
      />
    </div>
  );
};
