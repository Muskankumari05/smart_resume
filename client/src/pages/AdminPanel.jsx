import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, Users, Briefcase, FileText, CheckCircle2, Shield, UserCheck } from 'lucide-react';

export const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/stats'),
      ]);
      if (usersRes.data.success) setUsers(usersRes.data.data);
      if (statsRes.data.success) setStats(statsRes.data.data);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'recruiter' : 'admin';
    if (!window.confirm(`Change role for user to ${newRole}?`)) return;

    try {
      await axios.patch(`/api/admin/users/${userId}/role`, { role: newRole });
      fetchAdminData();
    } catch (err) {
      alert('Failed to update role.');
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-purple-400" /> System Admin Console
        </h1>
        <p className="text-xs text-slate-400">
          Manage system users, access authorization roles, and system-wide ATS metrics
        </p>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Total Users</span>
          <p className="text-2xl font-extrabold text-slate-100">{stats?.totalUsers || 0}</p>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Total Active Jobs</span>
          <p className="text-2xl font-extrabold text-indigo-400">{stats?.totalJobs || 0}</p>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Candidates Stored</span>
          <p className="text-2xl font-extrabold text-purple-400">{stats?.totalCandidates || 0}</p>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Screenings Calculated</span>
          <p className="text-2xl font-extrabold text-emerald-400">{stats?.totalApplications || 0}</p>
        </div>
      </div>

      {/* Users Management Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden space-y-4 p-5">
        <h3 className="text-sm font-bold text-slate-200">Registered System Users & Role Authorization</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Current Role</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4 font-bold text-slate-100 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-indigo-400" /> {u.name}
                  </td>
                  <td className="p-4 text-slate-400">{u.email}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize border ${
                      u.role === 'admin'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                    }`}>
                      {u.role === 'admin' && <Shield className="w-3 h-3 text-purple-300" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleRoleChange(u._id, u.role)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg hover:bg-indigo-500/20 transition-all"
                    >
                      Switch to {u.role === 'admin' ? 'Recruiter' : 'Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
