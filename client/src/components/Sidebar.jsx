import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  GitCompare,
  HelpCircle,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/jobs', label: 'Jobs & Positions', icon: Briefcase },
    { to: '/candidates', label: 'Candidate Profiles', icon: Users },
    { to: '/candidates/compare', label: 'Compare Candidates', icon: GitCompare },
  ];

  if (user?.role === 'admin') {
    links.push({ to: '/admin', label: 'Admin Console', icon: ShieldCheck });
  }

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/60 p-4 space-y-6 shrink-0 hidden md:block min-h-[calc(100vh-61px)]">
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Navigation
        </p>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </NavLink>
          );
        })}
      </div>

      <div className="border-t border-slate-800/80 pt-4 space-y-1">
        <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Account & Role
        </p>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`
          }
        >
          <UserCheck className="w-4 h-4" />
          Recruiter Profile
        </NavLink>
      </div>
    </aside>
  );
};
