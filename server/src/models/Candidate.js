import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      default: 'Unknown',
    },
    skills: [{ type: String, lowercase: true, trim: true }],
    education: [
      {
        degree: String,
        institution: String,
        year: String,
      },
    ],
    experience: [
      {
        role: String,
        company: String,
        duration: String,
        description: String,
      },
    ],
    projects: [
      {
        name: String,
        description: String,
        technologies: [String],
      },
    ],
    certifications: [{ type: String }],
    yearsOfExperience: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      default: '',
    },
    resumeUrl: {
      type: String,
      required: true,
    },
    resumeText: {
      type: String,
      required: true,
    },
    embedding: [{ type: Number }],
  },
  { timestamps: true }
);

export const Candidate = mongoose.model('Candidate', candidateSchema);
