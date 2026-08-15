import { User } from '../models/User.js';
import { Job } from '../models/Job.js';
import { Candidate } from '../models/Candidate.js';
import { Application } from '../models/Application.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: 'System users fetched successfully.',
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['recruiter', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role. Allowed roles: recruiter, admin.' });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}.`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const getSystemStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalJobs = await Job.countDocuments();
    const totalCandidates = await Candidate.countDocuments();
    const totalApplications = await Application.countDocuments();

    res.status(200).json({
      success: true,
      message: 'System statistics fetched.',
      data: {
        totalUsers,
        totalRecruiters,
        totalAdmins,
        totalJobs,
        totalCandidates,
        totalApplications,
      },
    });
  } catch (error) {
    next(error);
  }
};
