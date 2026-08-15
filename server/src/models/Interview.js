import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
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
    technicalQuestions: [
      {
        question: String,
        evaluationCriteria: String,
      },
    ],
    behavioralQuestions: [
      {
        question: String,
        evaluationCriteria: String,
      },
    ],
    projectQuestions: [
      {
        question: String,
        evaluationCriteria: String,
      },
    ],
    skillGapQuestions: [
      {
        question: String,
        evaluationCriteria: String,
      },
    ],
  },
  { timestamps: true }
);

export const Interview = mongoose.model('Interview', interviewSchema);
