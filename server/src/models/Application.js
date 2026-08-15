import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
    },
    semanticScore: { type: Number, default: 0 },
    skillScore: { type: Number, default: 0 },
    experienceScore: { type: Number, default: 0 },
    educationScore: { type: Number, default: 0 },
    keywordScore: { type: Number, default: 0 },
    projectCertificationScore: { type: Number, default: 0 },
    finalScore: { type: Number, default: 0, index: true },
    rank: { type: Number, default: 0 },
    matchedSkills: [{ type: String, lowercase: true, trim: true }],
    missingSkills: {
      required: [{ type: String, lowercase: true, trim: true }],
      preferred: [{ type: String, lowercase: true, trim: true }],
      additional: [{ type: String, lowercase: true, trim: true }],
    },
    matchedKeywords: [{ type: String, lowercase: true, trim: true }],
    missingKeywords: [{ type: String, lowercase: true, trim: true }],
    recommendation: {
      type: String,
      enum: ['Strong Match', 'Good Match', 'Moderate Match', 'Weak Match'],
      default: 'Moderate Match',
    },
    status: {
      type: String,
      enum: ['applied', 'screening', 'shortlisted', 'rejected'],
      default: 'screening',
    },
    aiAnalysis: {
      explanation: { type: String, default: '' },
      pros: [{ type: String }],
      cons: [{ type: String }],
    },
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

export const Application = mongoose.model('Application', applicationSchema);
