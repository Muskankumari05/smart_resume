import { queryAI } from './ai.service.js';

const KNOWN_SKILLS = [
  'javascript', 'typescript', 'react', 'react.js', 'vue', 'angular', 'node.js', 'express',
  'python', 'django', 'fastapi', 'java', 'spring boot', 'c++', 'c#', '.net', 'golang', 'rust',
  'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'aws', 'azure', 'gcp',
  'docker', 'kubernetes', 'ci/cd', 'git', 'rest api', 'graphql', 'tailwind css', 'bootstrap',
  'html', 'css', 'next.js', 'microservices', 'agile', 'scrum', 'jira', 'figma'
];

export const analyzeJobDescription = async (title, description) => {
  const prompt = `
Analyze the following Job Description and extract key recruitment parameters in JSON format.

Title: ${title}
Description:
${description}

Return ONLY JSON matching this structure:
{
  "title": "${title}",
  "requiredSkills": ["skill1", "skill2"],
  "preferredSkills": ["skill1", "skill2"],
  "responsibilities": ["resp1", "resp2"],
  "experienceRequired": 3,
  "educationRequired": ["Bachelor in CS or related field"],
  "certificationsRequired": ["AWS Certified Architect"],
  "keywords": ["keyword1", "keyword2"]
}
`;

  try {
    const aiResult = await queryAI(prompt);

    if (aiResult && Array.isArray(aiResult.requiredSkills)) {
      return {
        title: aiResult.title || title,
        requiredSkills: (aiResult.requiredSkills || []).map((s) => s.toLowerCase().trim()),
        preferredSkills: (aiResult.preferredSkills || []).map((s) => s.toLowerCase().trim()),
        responsibilities: aiResult.responsibilities || [],
        experienceRequired: typeof aiResult.experienceRequired === 'number' ? aiResult.experienceRequired : 2,
        educationRequired: aiResult.educationRequired || ['Bachelor Degree'],
        certificationsRequired: aiResult.certificationsRequired || [],
        keywords: (aiResult.keywords || []).map((k) => k.toLowerCase().trim()),
      };
    }
  } catch (err) {
    console.warn('[Job Analysis AI Fallback Triggered]:', err.message);
  }

  // Fallback Rule-Based Parser
  const descLower = description.toLowerCase();
  const foundSkills = KNOWN_SKILLS.filter((s) => descLower.includes(s));

  // Extract years of experience using regex match
  const expMatch = descLower.match(/(\d+)\+?\s*(?:years|yrs)\s*(?:of)?\s*experience/i);
  const years = expMatch ? parseInt(expMatch[1], 10) : 2;

  const requiredSkills = foundSkills.slice(0, Math.ceil(foundSkills.length * 0.7));
  const preferredSkills = foundSkills.slice(Math.ceil(foundSkills.length * 0.7));

  return {
    title,
    requiredSkills: requiredSkills.length > 0 ? requiredSkills : ['javascript', 'node.js', 'react'],
    preferredSkills: preferredSkills.length > 0 ? preferredSkills : ['aws', 'docker'],
    responsibilities: [
      'Design, build, and maintain efficient, reusable, and reliable code.',
      'Collaborate with cross-functional teams to define and ship new features.',
    ],
    experienceRequired: years,
    educationRequired: ["Bachelor's Degree in Computer Science, Software Engineering or related field"],
    certificationsRequired: [],
    keywords: Array.from(new Set([...foundSkills, title.toLowerCase()])).slice(0, 10),
  };
};
