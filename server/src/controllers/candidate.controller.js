import { Candidate } from '../models/Candidate.js';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { parsePdf } from '../parsers/pdfParser.js';
import { parseDocx } from '../parsers/docxParser.js';
import { analyzeResumeText } from '../ai/resumeAnalysis.service.js';
import { generateEmbedding } from '../embeddings/embedding.service.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { calculateApplicationScore } from '../ranking/scoring.service.js';
import { recalculateJobRankings } from '../ranking/ranking.service.js';

export const uploadResumes = async (req, res, next) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    const { jobId } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No resume files provided. Please upload at least one .pdf or .docx file.',
      });
    }

    let targetJob = null;
    if (jobId) {
      targetJob = await Job.findById(jobId);
    }

    const processedCandidates = [];
    const processedApplications = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const ext = file.originalname.split('.').pop().toLowerCase();
        let extractedText = '';

        if (ext === 'pdf') {
          extractedText = await parsePdf(file.buffer);
        } else if (['docx', 'doc'].includes(ext)) {
          extractedText = await parseDocx(file.buffer);
        } else {
          throw new Error(`Unsupported file type: .${ext}`);
        }

        // Upload resume file to Cloudinary / storage
        const resumeUrl = await uploadToCloudinary(file.buffer, file.originalname);

        // AI Candidate analysis
        const candData = await analyzeResumeText(extractedText, file.originalname);

        // Generate vector embedding
        const embedding = generateEmbedding(extractedText);

        // Create or update Candidate record
        let candidate = await Candidate.findOne({ email: candData.email });
        if (candidate) {
          candidate.name = candData.name || candidate.name;
          candidate.phone = candData.phone || candidate.phone;
          candidate.skills = candData.skills;
          candidate.education = candData.education;
          candidate.experience = candData.experience;
          candidate.projects = candData.projects;
          candidate.certifications = candData.certifications;
          candidate.yearsOfExperience = candData.yearsOfExperience;
          candidate.resumeUrl = resumeUrl;
          candidate.resumeText = extractedText;
          candidate.embedding = embedding;
          await candidate.save();
        } else {
          candidate = await Candidate.create({
            ...candData,
            resumeUrl,
            resumeText: extractedText,
            embedding,
          });
        }

        processedCandidates.push(candidate);

        // If uploaded specifically for a job, screen immediately
        if (targetJob) {
          const scoreResults = calculateApplicationScore(targetJob, candidate);

          const app = await Application.findOneAndUpdate(
            { job: targetJob._id, candidate: candidate._id },
            {
              job: targetJob._id,
              candidate: candidate._id,
              ...scoreResults,
            },
            { upsert: true, new: true }
          );

          processedApplications.push(app);
        }
      } catch (fileErr) {
        console.error(`Error processing file ${file.originalname}:`, fileErr);
        errors.push({ filename: file.originalname, error: fileErr.message });
      }
    }

    if (targetJob) {
      await recalculateJobRankings(targetJob._id);
    }

    res.status(200).json({
      success: true,
      message: `Processed ${processedCandidates.length} resume(s) successfully.${
        errors.length > 0 ? ` ${errors.length} failed.` : ''
      }`,
      data: {
        candidates: processedCandidates,
        applications: processedApplications,
        errors,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCandidates = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const { search, skill, minExp } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (skill) {
      query.skills = { $in: [skill.toLowerCase().trim()] };
    }

    if (minExp) {
      query.yearsOfExperience = { $gte: Number(minExp) };
    }

    const total = await Candidate.countDocuments(query);
    const candidates = await Candidate.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: 'Candidates retrieved successfully.',
      data: {
        candidates,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCandidateById = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found.' });
    }

    const applications = await Application.find({ candidate: candidate._id }).populate('job', 'title company location');

    res.status(200).json({
      success: true,
      message: 'Candidate profile details fetched.',
      data: {
        candidate,
        applications,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found.' });
    }

    await Application.deleteMany({ candidate: candidate._id });
    await Candidate.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Candidate deleted successfully.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
