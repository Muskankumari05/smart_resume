import { calculateApplicationScore } from '../src/ranking/scoring.service.js';

describe('ATS Scoring Engine Tests', () => {
  const mockJob = {
    title: 'Senior Full Stack Developer',
    description: 'Looking for a Senior Full Stack Developer proficient in React, Node.js, MongoDB, AWS, and Docker with 3+ years experience.',
    requiredSkills: ['react', 'node.js', 'mongodb', 'aws', 'docker'],
    preferredSkills: ['typescript', 'graphql'],
    experienceRequired: 3,
    educationRequired: ['Bachelor in Computer Science'],
    keywords: ['react', 'node.js', 'mongodb', 'aws', 'docker', 'rest api'],
  };

  const mockCandidate = {
    name: 'John Doe',
    skills: ['react', 'node.js', 'mongodb', 'docker', 'git'],
    yearsOfExperience: 4,
    education: [{ degree: 'Bachelor of Science in Computer Science', institution: 'State University', year: '2020' }],
    resumeText: 'John Doe Senior Full Stack Developer proficient in React, Node.js, MongoDB, Docker. 4 years of experience.',
    projects: [{ name: 'SaaS Platform', description: 'Built using React and Node.js' }],
    certifications: ['AWS Cloud Practitioner'],
  };

  test('should return normalized final score between 0 and 100', () => {
    const score = calculateApplicationScore(mockJob, mockCandidate);
    expect(score.finalScore).toBeGreaterThanOrEqual(0);
    expect(score.finalScore).toBeLessThanOrEqual(100);
  });

  test('should correctly identify matched and missing required skills', () => {
    const score = calculateApplicationScore(mockJob, mockCandidate);
    expect(score.matchedSkills).toContain('react');
    expect(score.matchedSkills).toContain('node.js');
    expect(score.matchedSkills).toContain('mongodb');
    expect(score.matchedSkills).toContain('docker');
    expect(score.missingSkills.required).toContain('aws');
  });

  test('should classify strong candidate as Strong Match or Good Match', () => {
    const score = calculateApplicationScore(mockJob, mockCandidate);
    expect(['Strong Match', 'Good Match']).toContain(score.recommendation);
  });
});
