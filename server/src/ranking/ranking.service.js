import { Application } from '../models/Application.js';

export const recalculateJobRankings = async (jobId) => {
  const applications = await Application.find({ job: jobId }).sort({ finalScore: -1 });

  for (let i = 0; i < applications.length; i++) {
    applications[i].rank = i + 1;
    await applications[i].save();
  }

  return applications;
};

export const getFilteredRankings = async (jobId, filters = {}, sort = 'highest') => {
  let query = { job: jobId };

  if (filters.minScore) {
    query.finalScore = { $gte: Number(filters.minScore) };
  }

  if (filters.recommendation) {
    query.recommendation = filters.recommendation;
  }

  let sortOption = { finalScore: -1 }; // Default highest score

  if (sort === 'lowest') {
    sortOption = { finalScore: 1 };
  } else if (sort === 'semantic') {
    sortOption = { semanticScore: -1 };
  } else if (sort === 'skill') {
    sortOption = { skillScore: -1 };
  } else if (sort === 'experience') {
    sortOption = { experienceScore: -1 };
  }

  let applications = await Application.find(query)
    .populate('candidate')
    .populate('job', 'title company')
    .sort(sortOption);

  // In-memory filters for nested candidate fields
  if (filters.skill) {
    const searchSkill = filters.skill.toLowerCase().trim();
    applications = applications.filter((app) =>
      (app.candidate.skills || []).some((s) => s.toLowerCase().includes(searchSkill))
    );
  }

  if (filters.minExp) {
    const minYears = Number(filters.minExp);
    applications = applications.filter((app) => app.candidate.yearsOfExperience >= minYears);
  }

  if (filters.location) {
    const loc = filters.location.toLowerCase();
    applications = applications.filter((app) => (app.candidate.location || '').toLowerCase().includes(loc));
  }

  return applications;
};
