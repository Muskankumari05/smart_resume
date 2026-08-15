import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ScoreBadge } from '../components/ScoreBadge';
import { FairnessNote } from '../components/FairnessNote';
import {
  Briefcase,
  Users,
  CheckCircle2,
  TrendingUp,
  Award,
  PlusCircle,
  BarChart2,
  FileSpreadsheet,
  ArrowUpRight,
  UserCheck,
  UserX,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('/api/analytics/dashboard');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const charts = data?.charts || {};

  const PIE_COLORS = ['#f43f5e', '#f59e0b', '#6366f1', '#10b981'];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Recruiter Overview & Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time candidate ranking pipeline, skill demand trends, and match distributions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/jobs/create"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-lg shadow-indigo-600/20"
          >
            <PlusCircle className="w-4 h-4" /> Create New Job
          </Link>
          <Link
            to="/candidates"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all border border-slate-700"
          >
            <Users className="w-4 h-4" /> View Candidates
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="glass-card p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Jobs</span>
            <Briefcase className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold text-slate-100">{kpis.totalJobs || 0}</p>
          <p className="text-[10px] text-emerald-400 flex items-center gap-0.5">Active positions</p>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Candidates</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-extrabold text-slate-100">{kpis.totalCandidates || 0}</p>
          <p className="text-[10px] text-purple-400">In resume database</p>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Screened</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-slate-100">{kpis.totalScreened || 0}</p>
          <p className="text-[10px] text-emerald-400">Applications evaluated</p>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Avg ATS Score</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-amber-400">{kpis.avgScore || 0}%</p>
          <p className="text-[10px] text-slate-400">System mean score</p>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Shortlisted</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400">{kpis.shortlistedCount || 0}</p>
          <p className="text-[10px] text-slate-400">Proceeding candidates</p>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Rejected</span>
            <UserX className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-extrabold text-rose-400">{kpis.rejectedCount || 0}</p>
          <p className="text-[10px] text-slate-400">Unmatched candidates</p>
        </div>
      </div>

      {/* Top Candidate Highlight Banner */}
      {kpis.topCandidate && (
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Top Candidate Highlight
              </span>
              <h3 className="text-lg font-bold text-slate-100 mt-1">
                {kpis.topCandidate.candidate?.name}
              </h3>
              <p className="text-xs text-slate-400">
                Applied for <span className="text-slate-200 font-semibold">{kpis.topCandidate.job?.title}</span> • {kpis.topCandidate.candidate?.location}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ScoreBadge score={kpis.topCandidate.finalScore} recommendation={kpis.topCandidate.recommendation} size="lg" />
            <Link
              to={`/candidates/${kpis.topCandidate.candidate?._id}`}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              View Profile <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Recharts Graphical Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Score Distribution */}
        <div className="glass-card p-5 rounded-2xl space-y-4 border border-slate-800">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-indigo-400" /> Score Distribution
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.scoreDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {(charts.scoreDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
            {(charts.scoreDistribution || []).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[idx] }}></span>
                <span className="text-slate-400 truncate">{item.range}: <strong className="text-slate-200">{item.count}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Candidates Per Job */}
        <div className="glass-card p-5 rounded-2xl space-y-4 border border-slate-800 lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-purple-400" /> Applicants per Job Position
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.candidatesPerJob || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="title" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="candidates" fill="#818cf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Jobs & Recent Candidates Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="glass-card p-5 rounded-2xl space-y-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200">Recent Job Positions</h3>
            <Link to="/jobs" className="text-xs text-indigo-400 hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {(data?.recentJobs || []).length > 0 ? (
              data.recentJobs.map((job) => (
                <div key={job._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-colors">
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">{job.title}</h4>
                    <p className="text-xs text-slate-400">{job.company} • {job.location}</p>
                  </div>
                  <Link
                    to={`/jobs/${job._id}`}
                    className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg hover:bg-indigo-500/20"
                  >
                    Manage
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic p-4 text-center">No active job postings created yet.</p>
            )}
          </div>
        </div>

        {/* Recent Candidates */}
        <div className="glass-card p-5 rounded-2xl space-y-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200">Recent Candidates Uploaded</h3>
            <Link to="/candidates" className="text-xs text-indigo-400 hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {(data?.recentCandidates || []).length > 0 ? (
              data.recentCandidates.map((cand) => (
                <div key={cand._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-colors">
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">{cand.name}</h4>
                    <p className="text-xs text-slate-400">{cand.email || 'No email'} • {cand.yearsOfExperience} yrs exp</p>
                  </div>
                  <Link
                    to={`/candidates/${cand._id}`}
                    className="text-xs font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-lg hover:bg-purple-500/20"
                  >
                    Profile
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic p-4 text-center">No candidates uploaded yet.</p>
            )}
          </div>
        </div>
      </div>

      <FairnessNote />
    </div>
  );
};
