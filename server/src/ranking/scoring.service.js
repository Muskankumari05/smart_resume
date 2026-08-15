import { calculateCosineSimilarity } from '../embeddings/embedding.service.js';

/**
 * Transparent ATS Scoring Engine
 *
 * Configurable Weights:
 * - Semantic Score: 30%
 * - Required Skills: 25%
 * - Experience Score: 15%
 * - Education Score: 10%
 * - Keyword Score: 10%
 * - Project & Certification Score: 10%
 */

export const DEFAULT_WEIGHTS = {
  semantic: 0.30,
  skills: 0.25,
  experience: 0.15,
  education: 0.10,
  keyword: 0.10,
  projectsCertifications: 0.10,
};

export const calculateApplicationScore = (job, candidate, weights = DEFAULT_WEIGHTS) => {
  // 1. Semantic Similarity Score (0 - 100)
  const semanticScore = calculateCosineSimilarity(job.description, candidate.resumeText);

  // 2. Skill Gap Analysis & Skill Score
  const candSkills = (candidate.skills || []).map((s) => s.toLowerCase().trim());
  const reqSkills = (job.requiredSkills || []).map((s) => s.toLowerCase().trim());
  const prefSkills = (job.preferredSkills || []).map((s) => s.toLowerCase().trim());

  const matchedSkills = [];
  const missingRequiredSkills = [];
  const missingPreferredSkills = [];
  const additionalSkills = [];

  reqSkills.forEach((skill) => {
    if (candSkills.includes(skill) || candSkills.some((cs) => cs.includes(skill) || skill.includes(cs))) {
      matchedSkills.push(skill);
    } else {
      missingRequiredSkills.push(skill);
    }
  });

  prefSkills.forEach((skill) => {
    if (candSkills.includes(skill) || candSkills.some((cs) => cs.includes(skill) || skill.includes(cs))) {
      if (!matchedSkills.includes(skill)) matchedSkills.push(skill);
    } else {
      missingPreferredSkills.push(skill);
    }
  });

  candSkills.forEach((skill) => {
    if (!matchedSkills.includes(skill)) {
      additionalSkills.push(skill);
    }
  });

  const reqMatchRatio = reqSkills.length > 0 ? (matchedSkills.length / reqSkills.length) : 1;
  const prefMatchRatio = prefSkills.length > 0 ? (prefSkills.filter((s) => candSkills.includes(s)).length / prefSkills.length) : 1;
  const skillScore = Math.min(100, Math.round((reqMatchRatio * 0.8 + prefMatchRatio * 0.2) * 100));

  // 3. Experience Match Score (0 - 100)
  const requiredExp = job.experienceRequired || 0;
  const candExp = candidate.yearsOfExperience || 0;
  let experienceScore = 100;
  if (requiredExp > 0) {
    if (candExp >= requiredExp) {
      experienceScore = 100;
    } else {
      experienceScore = Math.round((candExp / requiredExp) * 100);
    }
  }

  // 4. Education Score (0 - 100)
  let educationScore = 70; // Baseline
  const candEduText = JSON.stringify(candidate.education || []).toLowerCase();
  const reqEduText = (job.educationRequired || []).join(' ').toLowerCase();

  if (reqEduText.length === 0 || candEduText.includes('bachelor') || candEduText.includes('master') || candEduText.includes('phd')) {
    educationScore = 90;
  }
  if (candEduText.includes('computer science') || candEduText.includes('engineering') || candEduText.includes('technology')) {
    educationScore = 100;
  }

  // 5. ATS Keyword Match Score (0 - 100)
  const keywords = (job.keywords || []).map((k) => k.toLowerCase().trim());
  const resumeTextLower = (candidate.resumeText || '').toLowerCase();

  const matchedKeywords = [];
  const missingKeywords = [];

  keywords.forEach((kw) => {
    if (resumeTextLower.includes(kw)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const keywordScore = keywords.length > 0 ? Math.round((matchedKeywords.length / keywords.length) * 100) : 85;

  // 6. Projects & Certifications Score (0 - 100)
  const hasProjects = (candidate.projects || []).length > 0;
  const hasCerts = (candidate.certifications || []).length > 0;
  let projectCertificationScore = 50;
  if (hasProjects && hasCerts) projectCertificationScore = 100;
  else if (hasProjects) projectCertificationScore = 85;
  else if (hasCerts) projectCertificationScore = 75;

  // 7. Calculate Final Score (0 - 100)
  const rawFinalScore =
    semanticScore * weights.semantic +
    skillScore * weights.skills +
    experienceScore * weights.experience +
    educationScore * weights.education +
    keywordScore * weights.keyword +
    projectCertificationScore * weights.projectsCertifications;

  const finalScore = Math.min(100, Math.max(0, Math.round(rawFinalScore)));

  // 8. Recommendation Engine
  let recommendation = 'Weak Match';
  if (finalScore >= 90) recommendation = 'Strong Match';
  else if (finalScore >= 75) recommendation = 'Good Match';
  else if (finalScore >= 60) recommendation = 'Moderate Match';

  // 9. AI Explanation Generator
  const explanation = `Candidate demonstrates a ${recommendation.toLowerCase()} (${finalScore}% ATS Score). ` +
    `Skill match is at ${skillScore}% with ${matchedSkills.length} matching skills. ` +
    (missingRequiredSkills.length > 0
      ? `Primary missing skills: ${missingRequiredSkills.slice(0, 3).join(', ')}.`
      : `Candidate satisfies all core technical skill requirements.`);

  return {
    semanticScore,
    skillScore,
    experienceScore,
    educationScore,
    keywordScore,
    projectCertificationScore,
    finalScore,
    matchedSkills,
    missingSkills: {
      required: missingRequiredSkills,
      preferred: missingPreferredSkills,
      additional: additionalSkills,
    },
    matchedKeywords,
    missingKeywords,
    recommendation,
    aiAnalysis: {
      explanation,
      pros: [
        `Semantic match score of ${semanticScore}% with job description.`,
        `${matchedSkills.length} key required skills verified on resume.`,
        `${candExp} years of relevant industry experience.`,
      ],
      cons: missingRequiredSkills.length > 0 ? [`Missing required skills: ${missingRequiredSkills.join(', ')}`] : [],
    },
  };
};
