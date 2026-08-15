import { Job } from '../models/Job.js';
import { Candidate } from '../models/Candidate.js';
import { Application } from '../models/Application.js';
import { calculateApplicationScore } from '../ranking/scoring.service.js';
import { recalculateJobRankings } from '../ranking/ranking.service.js';

export const screenCandidate = async (req, res, next) => {
  try {
    const { jobId, candidateId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ success: false, message: 'Candidate not found.' });

    const scoreResults = calculateApplicationScore(job, candidate);

    const application = await Application.findOneAndUpdate(
      { job: jobId, candidate: candidateId },
      {
        job: jobId,
        candidate: candidateId,
        ...scoreResults,
      },
      { upsert: true, new: true }
    ).populate('candidate');

    await recalculateJobRankings(jobId);

    res.status(200).json({
      success: true,
      message: 'Candidate screened successfully.',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

export const screenAllForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

    const candidates = await Candidate.find();
    if (candidates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No candidates available in the database to screen.',
      });
    }

    const applications = [];
    for (const candidate of candidates) {
      const scoreResults = calculateApplicationScore(job, candidate);

      const app = await Application.findOneAndUpdate(
        { job: jobId, candidate: candidate._id },
        {
          job: jobId,
          candidate: candidate._id,
          ...scoreResults,
        },
        { upsert: true, new: true }
      );
      applications.push(app);
    }

    await recalculateJobRankings(jobId);

    const rankedApps = await Application.find({ job: jobId })
      .populate('candidate')
      .sort({ finalScore: -1 });

    res.status(200).json({
      success: true,
      message: `Successfully screened ${candidates.length} candidate(s) for ${job.title}.`,
      data: rankedApps,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobScreenings = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const applications = await Application.find({ job: jobId })
      .populate('candidate')
      .sort({ finalScore: -1 });

    res.status(200).json({
      success: true,
      message: 'Job screenings fetched.',
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['applied', 'screening', 'shortlisted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const application = await Application.findByIdAndUpdate(id, { status }, { new: true });
    if (!application) return res.status(404).json({ success: false, message: 'Application not found.' });

    res.status(200).json({
      success: true,
      message: `Candidate application status updated to ${status}.`,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};
