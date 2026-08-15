import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    location: {
      type: String,
      default: 'Remote',
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requiredSkills: [{ type: String, lowercase: true, trim: true }],
    preferredSkills: [{ type: String, lowercase: true, trim: true }],
    responsibilities: [{ type: String }],
    experienceRequired: {
      type: Number,
      default: 0,
    },
    educationRequired: [{ type: String }],
    certificationsRequired: [{ type: String }],
    keywords: [{ type: String, lowercase: true, trim: true }],
    embedding: [{ type: Number }], // Vector embedding for Atlas Vector Search / Cosine similarity
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export const Job = mongoose.model('Job', jobSchema);
