import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ScoreBadge } from '../components/ScoreBadge';
import { SkillGapCard } from '../components/SkillGapCard';
import { FairnessNote } from '../components/FairnessNote';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  HelpCircle,
  GitCompare,
  FileText,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react';

export const CandidateProfile = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showResumeText, setShowResumeText] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const res = await axios.get(`/api/candidates/${id}`);
        if (res.data.success) {
          setCandidate(res.data.data.candidate);
          setApplications(res.data.data.applications);
          if (res.data.data.applications.length > 0) {
            setSelectedApp(res.data.data.applications[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch candidate profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id]);

  if (loading || !candidate) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const app = selectedApp || {};
  const score = app.finalScore !== undefined ? app.finalScore : 85;

  return (
    <div className="space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header Profile Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 border border-purple-500/30 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-purple-600/25">
              {candidate.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-100">{candidate.name}</h1>
                <ScoreBadge score={score} recommendation={app.recommendation || 'Good Match'} size="lg" />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                {candidate.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-500" /> {candidate.email}</span>}
                {candidate.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-500" /> {candidate.phone}</span>}
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {candidate.location}</span>
                <span>• {candidate.yearsOfExperience} Yrs Experience</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/interview/${candidate._id}${app.job ? `?jobId=${app.job._id}` : ''}`}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> AI Interview Prep
            </Link>
            <Link
              to={`/candidates/compare?cand1=${candidate._id}`}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2"
            >
              <GitCompare className="w-4 h-4" /> Compare Candidate
            </Link>
            <button
              onClick={() => setShowResumeText(!showResumeText)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 p-2.5 rounded-xl text-xs font-semibold"
              title="View Extracted Resume Text"
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Screening Application Selector if candidate applied for multiple jobs */}
        {applications.length > 1 && (
          <div className="flex items-center gap-3 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="font-semibold text-slate-400">Select Job Evaluation:</span>
            <select
              value={selectedApp?._id}
              onChange={(e) => setSelectedApp(applications.find((a) => a._id === e.target.value))}
              className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 outline-none font-medium"
            >
              {applications.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.job?.title} ({a.finalScore}% match)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ATS Multi-Criteria Score Breakdown Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            ATS Weighted Score Breakdown (Job: {app.job?.title || 'Global Job Evaluation'})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400">Semantic Similarity (30%)</span>
              <p className="text-lg font-bold text-indigo-400 mt-1">{app.semanticScore || 0}%</p>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400">Skill Match (25%)</span>
              <p className="text-lg font-bold text-purple-400 mt-1">{app.skillScore || 0}%</p>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400">Experience (15%)</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">{app.experienceScore || 0}%</p>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400">Education (10%)</span>
              <p className="text-lg font-bold text-amber-400 mt-1">{app.educationScore || 0}%</p>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400">Keyword Match (10%)</span>
              <p className="text-lg font-bold text-sky-400 mt-1">{app.keywordScore || 0}%</p>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400">Projects & Certs (10%)</span>
              <p className="text-lg font-bold text-pink-400 mt-1">{app.projectCertificationScore || 0}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Text Modal view */}
      {showResumeText && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" /> Extracted Raw Resume Text
            </h3>
            <button onClick={() => setShowResumeText(false)} className="text-xs text-rose-400 hover:underline">
              Close
            </button>
          </div>
          <pre className="bg-slate-900 p-4 rounded-xl text-xs text-slate-300 font-mono overflow-x-auto max-h-60 leading-relaxed whitespace-pre-wrap border border-slate-800">
            {candidate.resumeText}
          </pre>
        </div>
      )}

      {/* Two Column Layout: Skill Gap + AI Summary vs Candidate Experience/Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Skill Gap & AI Explanation */}
        <div className="space-y-6 lg:col-span-1">
          <SkillGapCard matchedSkills={app.matchedSkills || candidate.skills} missingSkills={app.missingSkills} />

          {/* AI Analysis Explanation Box */}
          <div className="glass-card p-5 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" /> AI Recommendation Explanation
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {app.aiAnalysis?.explanation || candidate.summary || 'Candidate demonstrates valid technical match qualifications.'}
            </p>
          </div>
        </div>

        {/* Right Column: Work Experience, Education, Projects & Certifications */}
        <div className="space-y-6 lg:col-span-2">
          {/* Work Experience */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" /> Work Experience
            </h3>
            {(candidate.experience || []).length > 0 ? (
              <div className="space-y-4">
                {candidate.experience.map((exp, idx) => (
                  <div key={idx} className="border-l-2 border-indigo-500/40 pl-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-200">{exp.role}</h4>
                      <span className="text-xs text-slate-400">{exp.duration}</span>
                    </div>
                    <p className="text-xs text-indigo-400 font-medium">{exp.company}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No specific experience details extracted.</p>
            )}
          </div>

          {/* Projects */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" /> Notable Technical Projects
            </h3>
            {(candidate.projects || []).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {candidate.projects.map((proj, idx) => (
                  <div key={idx} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-slate-100">{proj.name}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>
                    {proj.technologies && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.technologies.map((tech, tIdx) => (
                          <span key={tIdx} className="bg-slate-800 text-indigo-300 text-[10px] px-2 py-0.5 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No technical projects extracted.</p>
            )}
          </div>

          {/* Education & Certifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Education */}
            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-400" /> Education
              </h3>
              {(candidate.education || []).map((edu, idx) => (
                <div key={idx} className="text-xs space-y-0.5">
                  <p className="font-bold text-slate-200">{edu.degree}</p>
                  <p className="text-slate-400">{edu.institution} ({edu.year})</p>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" /> Certifications
              </h3>
              {(candidate.certifications || []).length > 0 ? (
                <div className="space-y-1.5">
                  {candidate.certifications.map((cert, idx) => (
                    <div key={idx} className="text-xs bg-slate-900 p-2 rounded-lg text-emerald-300 font-medium">
                      ✓ {cert}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No certifications listed.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <FairnessNote />
    </div>
  );
};
