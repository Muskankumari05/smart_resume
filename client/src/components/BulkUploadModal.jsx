import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, X, Loader2 } from 'lucide-react';

export const BulkUploadModal = ({ isOpen, onClose, jobId, onUploadComplete }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [resultSummary, setResultSummary] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setProgress(10);
    setStatusText(`Uploading & Parsing ${files.length} resume(s)...`);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('resumes', file);
    });
    if (jobId) {
      formData.append('jobId', jobId);
    }

    try {
      setProgress(40);
      setStatusText(`Extracting PDF/DOCX text & AI parsing candidate profiles...`);

      const res = await axios.post('/api/candidates/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 70) / progressEvent.total);
          setProgress(Math.max(20, percentCompleted));
        },
      });

      setProgress(100);
      setStatusText('Screening complete!');
      setResultSummary(res.data.data);

      if (onUploadComplete) {
        onUploadComplete(res.data.data);
      }
    } catch (err) {
      console.error('Bulk upload failed:', err);
      setStatusText(`Upload failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-800 p-6 space-y-5 relative shadow-2xl">
        <button
          onClick={onClose}
          disabled={uploading}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <UploadCloud className="w-6 h-6 text-indigo-400" />
            Upload Candidate Resumes
          </h3>
          <p className="text-xs text-slate-400">
            Upload single or bulk PDF / DOCX resumes (up to 100 files). AI will automatically parse profiles, calculate ATS scores, and rank candidates.
          </p>
        </div>

        {/* File Dropzone */}
        {!uploading && !resultSummary && (
          <div className="space-y-4">
            <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition-all text-center">
              <UploadCloud className="w-10 h-10 text-indigo-400 mb-2 animate-bounce" />
              <p className="text-sm font-semibold text-slate-200">
                Click to browse or drag & drop files here
              </p>
              <p className="text-xs text-slate-500 mt-1">Supports PDF (.pdf) & Word (.docx) up to 10MB each</p>
              <input
                type="file"
                multiple
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {files.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Selected Files ({files.length})</span>
                  <button onClick={() => setFiles([])} className="text-rose-400 hover:underline">
                    Clear all
                  </button>
                </div>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {files.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs bg-slate-900 p-2 rounded-lg text-slate-300">
                      <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="truncate flex-1">{f.name}</span>
                      <span className="text-[10px] text-slate-500">{(f.size / 1024).toFixed(1)} KB</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={files.length === 0}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all"
            >
              Analyze & Screen {files.length > 0 ? `${files.length} Resume(s)` : ''}
            </button>
          </div>
        )}

        {/* Progress Bar */}
        {uploading && (
          <div className="space-y-4 py-4 text-center">
            <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-200">{statusText}</p>
              <p className="text-xs text-slate-400">Please wait while the AI pipeline processes the resumes...</p>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Results summary */}
        {resultSummary && (
          <div className="space-y-4 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-lg font-bold text-slate-100">Screening Complete!</h4>
            <p className="text-xs text-slate-300">
              Processed {resultSummary.candidates?.length || 0} candidate(s) successfully into the ranking pipeline.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-semibold text-sm transition-all"
            >
              View Ranked Candidates
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
