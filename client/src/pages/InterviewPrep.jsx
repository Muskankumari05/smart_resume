import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, HelpCircle, CheckCircle2, FileText, Code, Users, Award, AlertTriangle } from 'lucide-react';

export const InterviewPrep = () => {
  const { candidateId } = useParams();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');

  const [interview, setInterview] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`/api/interview/${candidateId}${jobId ? `?jobId=${jobId}` : ''}`);
      if (res.data.success) {
        setInterview(res.data.data);
      }
    } catch (err) {
      // If not generated yet, attempt auto generation
      handleGenerate();
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // Fetch default job if not provided
      let targetJobId = jobId;
      if (!targetJobId) {
        const jobsRes = await axios.get('/api/jobs');
        if (jobsRes.data.data.length > 0) {
          targetJobId = jobsRes.data.data[0]._id;
        }
      }

      if (!targetJobId) {
        alert('Please create at least one job position first.');
        setGenerating(false);
        setLoading(false);
        return;
      }

      const res = await axios.post('/api/interview/generate', {
        candidateId,
        jobId: targetJobId,
      });

      if (res.data.success) {
        setInterview(res.data.data);
      }
    } catch (err) {
      console.error('Failed to generate interview prep:', err);
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCandidateInfo = async () => {
      try {
        const res = await axios.get(`/api/candidates/${candidateId}`);
        if (res.data.success) {
          setCandidate(res.data.data.candidate);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCandidateInfo();
    fetchQuestions();
  }, [candidateId]);

  if (loading || generating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-300">
          Generating AI Interview Questions & Evaluation Rubrics...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">
              Recruiter Evaluation Prep Sheet
            </span>
            <h1 className="text-2xl font-extrabold text-slate-100 mt-1">
              AI Interview Questions for {candidate?.name || 'Candidate'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Position: <strong className="text-slate-200">{interview?.job?.title || 'Target Job Position'}</strong>
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" /> Regenerate Questions
          </button>
        </div>
      </div>

      {interview ? (
        <div className="space-y-8">
          {/* Section 1: Technical Questions (5) */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Code className="w-5 h-5 text-indigo-400" /> Technical Core Questions (5)
            </h2>
            <div className="space-y-4">
              {(interview.technicalQuestions || []).map((q, idx) => (
                <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
                  <p className="text-sm font-bold text-slate-200">
                    <span className="text-indigo-400 mr-2">Q{idx + 1}.</span> {q.question}
                  </p>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
                    <strong className="text-indigo-300 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Recruiter Evaluation Tip:
                    </strong>
                    <p>{q.evaluationCriteria}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Behavioral Questions (3) */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Users className="w-5 h-5 text-purple-400" /> Behavioral & Cultural Fit Questions (3)
            </h2>
            <div className="space-y-4">
              {(interview.behavioralQuestions || []).map((q, idx) => (
                <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
                  <p className="text-sm font-bold text-slate-200">
                    <span className="text-purple-400 mr-2">Q{idx + 1}.</span> {q.question}
                  </p>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
                    <strong className="text-purple-300 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Recruiter Evaluation Tip:
                    </strong>
                    <p>{q.evaluationCriteria}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Project Experience Questions (3) */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Award className="w-5 h-5 text-emerald-400" /> Project Deep-Dive Questions (3)
            </h2>
            <div className="space-y-4">
              {(interview.projectQuestions || []).map((q, idx) => (
                <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
                  <p className="text-sm font-bold text-slate-200">
                    <span className="text-emerald-400 mr-2">Q{idx + 1}.</span> {q.question}
                  </p>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
                    <strong className="text-emerald-300 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Recruiter Evaluation Tip:
                    </strong>
                    <p>{q.evaluationCriteria}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Skill Gap Questions (3) */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" /> Skill Gap Probing Questions (3)
            </h2>
            <div className="space-y-4">
              {(interview.skillGapQuestions || []).map((q, idx) => (
                <div key={idx} className="glass-card p-5 rounded-2xl border border-rose-500/20 bg-rose-950/10 space-y-2">
                  <p className="text-sm font-bold text-slate-200">
                    <span className="text-rose-400 mr-2">Q{idx + 1}.</span> {q.question}
                  </p>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
                    <strong className="text-rose-300 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Recruiter Evaluation Tip:
                    </strong>
                    <p>{q.evaluationCriteria}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center space-y-3">
          <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">No interview questions generated yet.</p>
          <button
            onClick={handleGenerate}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold"
          >
            Generate Questions Now
          </button>
        </div>
      )}
    </div>
  );
};
