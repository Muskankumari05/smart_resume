import { Interview } from '../models/Interview.js';
import { Candidate } from '../models/Candidate.js';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { generateInterviewQuestions } from '../ai/interview.service.js';

export const generateInterview = async (req, res, next) => {
  try {
    const { candidateId, jobId } = req.body;

    if (!candidateId || !jobId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide candidateId and jobId.',
      });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ success: false, message: 'Candidate not found.' });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

    const application = await Application.findOne({ job: jobId, candidate: candidateId });
    const missingSkills = application?.missingSkills?.required || [];

    const questions = await generateInterviewQuestions(job, candidate, missingSkills);

    let interview = await Interview.findOne({ job: jobId, candidate: candidateId });
    if (interview) {
      interview.technicalQuestions = questions.technicalQuestions;
      interview.behavioralQuestions = questions.behavioralQuestions;
      interview.projectQuestions = questions.projectQuestions;
      interview.skillGapQuestions = questions.skillGapQuestions;
      await interview.save();
    } else {
      interview = await Interview.create({
        job: jobId,
        candidate: candidateId,
        ...questions,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Interview questions generated successfully.',
      data: interview,
    });
  } catch (error) {
    next(error);
  }
};

export const getInterviewByCandidate = async (req, res, next) => {
  try {
    const { candidateId } = req.params;
    const { jobId } = req.query;

    const query = { candidate: candidateId };
    if (jobId) query.job = jobId;

    const interview = await Interview.findOne(query)
      .populate('candidate')
      .populate('job', 'title company requiredSkills');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview questions not found for this candidate. Generate them first.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Interview prep sheet fetched successfully.',
      data: interview,
    });
  } catch (error) {
    next(error);
  }
};
