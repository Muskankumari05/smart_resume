import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { analyzeJobDescription } from '../ai/jobAnalysis.service.js';
import { generateEmbedding } from '../embeddings/embedding.service.js';

export const createJob = async (req, res, next) => {
  try {
    const { title, company, location, description } = req.body;

    if (!title || !company || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide job title, company, and job description.',
      });
    }

    // AI Job Analysis
    const analysis = await analyzeJobDescription(title, description);

    // Vector embedding for job description
    const embedding = generateEmbedding(description + ' ' + (analysis.requiredSkills || []).join(' '));

    const job = await Job.create({
      recruiter: req.user._id,
      title,
      company,
      location: location || 'Remote',
      description,
      requiredSkills: analysis.requiredSkills,
      preferredSkills: analysis.preferredSkills,
      responsibilities: analysis.responsibilities,
      experienceRequired: analysis.experienceRequired,
      educationRequired: analysis.educationRequired,
      certificationsRequired: analysis.certificationsRequired,
      keywords: analysis.keywords,
      embedding,
    });

    res.status(201).json({
      success: true,
      message: 'Job created and analyzed successfully.',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobs = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { recruiter: req.user._id };
    const jobs = await Job.find(filter).sort({ createdAt: -1 });

    // Attach application stats to each job
    const jobsWithStats = await Promise.all(
      jobs.map(async (job) => {
        const apps = await Application.find({ job: job._id });
        const applicantCount = apps.length;
        const avgScore =
          applicantCount > 0
            ? Math.round(apps.reduce((sum, a) => sum + a.finalScore, 0) / applicantCount)
            : 0;

        return {
          ...job.toObject(),
          applicantCount,
          avgScore,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: 'Jobs fetched successfully.',
      data: jobsWithStats,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.',
      });
    }

    const apps = await Application.find({ job: job._id }).populate('candidate').sort({ finalScore: -1 });
    const applicantCount = apps.length;
    const avgScore =
      applicantCount > 0
        ? Math.round(apps.reduce((sum, a) => sum + a.finalScore, 0) / applicantCount)
        : 0;

    res.status(200).json({
      success: true,
      message: 'Job details fetched successfully.',
      data: {
        ...job.toObject(),
        applicantCount,
        avgScore,
        topCandidates: apps.slice(0, 5),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job.' });
    }

    if (req.body.description && req.body.description !== job.description) {
      const analysis = await analyzeJobDescription(req.body.title || job.title, req.body.description);
      req.body.requiredSkills = analysis.requiredSkills;
      req.body.preferredSkills = analysis.preferredSkills;
      req.body.responsibilities = analysis.responsibilities;
      req.body.experienceRequired = analysis.experienceRequired;
      req.body.keywords = analysis.keywords;
      req.body.embedding = generateEmbedding(req.body.description);
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({
      success: true,
      message: 'Job updated successfully.',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job.' });
    }

    await Application.deleteMany({ job: job._id });
    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Job and associated applications deleted successfully.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
