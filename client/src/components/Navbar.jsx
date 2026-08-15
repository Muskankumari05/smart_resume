import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, LogOut, User, Shield, PlusCircle, FileText } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
      {/* Brand */}
      <Link to="/dashboard" className="flex items-center gap-2.5 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-extrabold text-lg tracking-tight gradient-text">SmartResume</span>
          <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider text-indigo-400 ml-2 font-semibold border border-indigo-500/30 px-1.5 py-0.5 rounded">
            ATS AI v2.0
          </span>
        </div>
      </Link>

      {/* Quick Actions & Profile */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link
              to="/jobs/create"
              className="hidden md:flex items-center gap-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-lg transition-all shadow-md shadow-indigo-600/20"
            >
              <PlusCircle className="w-4 h-4" />
              Post New Job
            </Link>

            <div className="h-6 w-px bg-slate-800 hidden md:block"></div>

            {/* Profile Dropdown Badge */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-200">{user.name}</p>
                <span className="text-[11px] font-medium text-slate-400 capitalize flex items-center justify-end gap-1">
                  {user.role === 'admin' && <Shield className="w-3 h-3 text-amber-400" />}
                  {user.role}
                </span>
              </div>

              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 text-indigo-400 flex items-center justify-center font-bold text-sm">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <button
                onClick={handleLogout}
                title="Logout"
                className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-slate-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-slate-300 hover:text-white font-medium">
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-md shadow-indigo-600/20"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
