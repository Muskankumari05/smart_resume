import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Briefcase, PlusCircle, Users, TrendingUp, MapPin, Trash2, Edit3, ArrowRight } from 'lucide-react';

export const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/jobs');
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this job posting and all its candidate screenings?')) return;
    try {
      await axios.delete(`/api/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      alert('Failed to delete job.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-400" />
            Job Positions
          </h1>
          <p className="text-xs text-slate-400">
            Create, manage, and screen candidate applicants across active postings
          </p>
        </div>

        <Link
          to="/jobs/create"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Create New Job
        </Link>
      </div>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between hover:border-indigo-500/50 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {job.company}
                    </span>
                    <h3 className="text-lg font-bold text-slate-100 mt-1 group-hover:text-indigo-300 transition-colors">
                      {job.title}
                    </h3>
                  </div>
                  <button
                    onClick={(e) => handleDelete(job._id, e)}
                    className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> {job.location}
                  </span>
                  <span>•</span>
                  <span>{job.experienceRequired}+ Yrs Exp</span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Required Skills Badges */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {(job.requiredSkills || []).slice(0, 4).map((s, idx) => (
                    <span key={idx} className="bg-slate-800 text-slate-300 text-[11px] px-2 py-0.5 rounded capitalize">
                      {s}
                    </span>
                  ))}
                  {(job.requiredSkills || []).length > 4 && (
                    <span className="text-[11px] text-slate-500 font-semibold self-center">
                      +{(job.requiredSkills || []).length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Metrics */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-purple-400" /> {job.applicantCount || 0} applicants
                  </span>
                  <span className="text-amber-400 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> {job.avgScore || 0}% avg
                  </span>
                </div>

                <Link
                  to={`/jobs/${job._id}`}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  Screen <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center space-y-4">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-200">No Job Positions Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't posted any jobs yet. Create a new job description to start uploading resumes and calculating candidate match scores.
          </p>
          <Link
            to="/jobs/create"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold text-xs shadow-lg shadow-indigo-600/20"
          >
            <PlusCircle className="w-4 h-4" /> Create First Job
          </Link>
        </div>
      )}
    </div>
  );
};
