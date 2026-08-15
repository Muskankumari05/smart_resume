import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Key } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 border border-indigo-500/30 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-indigo-600/25">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">{user?.name}</h1>
            <p className="text-xs text-slate-400">Recruiter Account Profile</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-400" /> Email Address
            </span>
            <span className="font-bold text-slate-200">{user?.email}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 font-medium flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" /> Account Role
            </span>
            <span className="font-bold text-purple-400 uppercase tracking-wider bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              {user?.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
