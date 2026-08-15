import { Job } from '../models/Job.js';
import { Candidate } from '../models/Candidate.js';
import { Application } from '../models/Application.js';

export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const jobFilter = req.user.role === 'admin' ? {} : { recruiter: req.user._id };

    const jobs = await Job.find(jobFilter);
    const jobIds = jobs.map((j) => j._id);

    const totalJobs = jobs.length;
    const totalCandidates = await Candidate.countDocuments();

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('candidate', 'name email location skills')
      .populate('job', 'title company');

    const totalScreened = applications.length;

    const avgScore =
      totalScreened > 0
        ? Math.round(applications.reduce((sum, app) => sum + app.finalScore, 0) / totalScreened)
        : 0;

    // Top Candidate
    const sortedApps = [...applications].sort((a, b) => b.finalScore - a.finalScore);
    const topCandidate = sortedApps[0] || null;

    const shortlistedCount = applications.filter((a) => a.status === 'shortlisted').length;
    const rejectedCount = applications.filter((a) => a.status === 'rejected').length;

    // Chart 1: Score Distribution Histogram
    const scoreRanges = [
      { range: '0-50 (Weak)', count: 0 },
      { range: '50-70 (Moderate)', count: 0 },
      { range: '70-85 (Good)', count: 0 },
      { range: '85-100 (Strong)', count: 0 },
    ];

    applications.forEach((app) => {
      if (app.finalScore < 50) scoreRanges[0].count++;
      else if (app.finalScore < 70) scoreRanges[1].count++;
      else if (app.finalScore < 85) scoreRanges[2].count++;
      else scoreRanges[3].count++;
    });

    // Chart 2: Candidates per job
    const candidatesPerJob = await Promise.all(
      jobs.slice(0, 6).map(async (job) => {
        const count = await Application.countDocuments({ job: job._id });
        return {
          title: job.title.length > 15 ? job.title.slice(0, 15) + '...' : job.title,
          candidates: count,
        };
      })
    );

    // Chart 3: Skill Demand Frequency
    const skillMap = {};
    jobs.forEach((job) => {
      (job.requiredSkills || []).forEach((skill) => {
        const s = skill.toLowerCase().trim();
        skillMap[s] = (skillMap[s] || 0) + 1;
      });
    });

    const skillDemand = Object.entries(skillMap)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const recentJobs = jobs.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
    const recentCandidates = await Candidate.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      message: 'Dashboard analytics retrieved successfully.',
      data: {
        kpis: {
          totalJobs,
          totalCandidates,
          totalScreened,
          avgScore,
          shortlistedCount,
          rejectedCount,
          topCandidate,
        },
        charts: {
          scoreDistribution: scoreRanges,
          candidatesPerJob,
          skillDemand,
        },
        recentJobs,
        recentCandidates,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getJobAnalytics = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

    const apps = await Application.find({ job: jobId }).populate('candidate');

    const totalApplicants = apps.length;
    const avgScore = totalApplicants > 0 ? Math.round(apps.reduce((s, a) => s + a.finalScore, 0) / totalApplicants) : 0;
    const strongMatches = apps.filter((a) => a.recommendation === 'Strong Match').length;

    res.status(200).json({
      success: true,
      message: 'Job specific analytics retrieved.',
      data: {
        job,
        totalApplicants,
        avgScore,
        strongMatches,
        applications: apps,
      },
    });
  } catch (error) {
    next(error);
  }
};
