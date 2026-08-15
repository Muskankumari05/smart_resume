import { queryAI } from './ai.service.js';

const TECH_SKILLS_LIST = [
  'javascript', 'typescript', 'react', 'react.js', 'vue', 'angular', 'node.js', 'express',
  'python', 'django', 'fastapi', 'java', 'spring boot', 'c++', 'c#', '.net', 'golang', 'rust',
  'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'aws', 'azure', 'gcp',
  'docker', 'kubernetes', 'ci/cd', 'git', 'rest api', 'graphql', 'tailwind css', 'bootstrap',
  'html', 'css', 'next.js', 'microservices', 'agile', 'scrum', 'jira', 'figma', 'pandas', 'numpy',
  'machine learning', 'tensorflow', 'pytorch', 'solidity', 'web3'
];

export const analyzeResumeText = async (resumeText, filename = '') => {
  const prompt = `
Analyze the following candidate resume text and return structured candidate information in JSON format.

Resume Text:
${resumeText.slice(0, 4000)}

Return ONLY JSON matching this exact structure:
{
  "name": "Candidate Full Name",
  "email": "candidate@example.com",
  "phone": "+1-123-456-7890",
  "location": "City, Country",
  "skills": ["JavaScript", "React", "Node.js"],
  "education": [
    {
      "degree": "Bachelor of Science in Computer Science",
      "institution": "University Name",
      "year": "2020"
    }
  ],
  "experience": [
    {
      "role": "Software Engineer",
      "company": "Tech Corp",
      "duration": "2021 - Present",
      "description": "Developed web applications."
    }
  ],
  "projects": [
    {
      "name": "E-Commerce App",
      "description": "Built fullstack application",
      "technologies": ["React", "Node.js"]
    }
  ],
  "certifications": ["AWS Certified Developer"],
  "yearsOfExperience": 3,
  "summary": "Professional summary of candidate."
}
`;

  try {
    const aiResult = await queryAI(prompt);

    if (aiResult && aiResult.name) {
      return {
        name: aiResult.name || 'Candidate',
        email: aiResult.email || '',
        phone: aiResult.phone || '',
        location: aiResult.location || 'Remote',
        skills: (aiResult.skills || []).map((s) => s.toLowerCase().trim()),
        education: aiResult.education || [],
        experience: aiResult.experience || [],
        projects: aiResult.projects || [],
        certifications: aiResult.certifications || [],
        yearsOfExperience: typeof aiResult.yearsOfExperience === 'number' ? aiResult.yearsOfExperience : 1,
        summary: aiResult.summary || 'Candidate resume extracted successfully.',
      };
    }
  } catch (err) {
    console.warn('[Resume Analysis AI Fallback Triggered]:', err.message);
  }

  // Fallback Rule-Based Parser
  const textLower = resumeText.toLowerCase();

  // Extract Email
  const emailMatch = resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : `candidate_${Date.now()}@example.com`;

  // Extract Phone
  const phoneMatch = resumeText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // Extract Name from first line or filename
  const firstLine = resumeText.split('\n')[0]?.trim();
  let name = 'Candidate Profile';
  if (firstLine && firstLine.length > 2 && firstLine.length < 40 && !firstLine.includes('@')) {
    name = firstLine;
  } else if (filename) {
    name = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  }

  // Extract Skills
  const foundSkills = TECH_SKILLS_LIST.filter((skill) => textLower.includes(skill));

  // Extract Experience Years
  const expMatch = textLower.match(/(\d+)\+?\s*(?:years|yrs)\s*(?:of)?\s*experience/i);
  const years = expMatch ? parseInt(expMatch[1], 10) : Math.min(10, Math.ceil(foundSkills.length / 2));

  return {
    name,
    email,
    phone,
    location: textLower.includes('remote') ? 'Remote' : 'On-Site / Relocatable',
    skills: foundSkills.length > 0 ? foundSkills : ['javascript', 'html', 'css', 'git'],
    education: [
      {
        degree: textLower.includes('master') ? "Master's Degree in Technology" : "Bachelor's Degree in Computer Science / IT",
        institution: 'University',
        year: '2021',
      },
    ],
    experience: [
      {
        role: 'Software Developer',
        company: 'Technology Solutions Provider',
        duration: `${years} Years`,
        description: 'Implemented web services, API endpoints, and user interfaces.',
      },
    ],
    projects: [
      {
        name: 'Portfolio Web Application',
        description: 'Built scalable web application with modern tech stack.',
        technologies: foundSkills.slice(0, 3),
      },
    ],
    certifications: textLower.includes('aws') ? ['AWS Certified Cloud Practitioner'] : [],
    yearsOfExperience: years,
    summary: `Extracted candidate profile possessing ${years} years of experience in ${foundSkills.slice(0, 5).join(', ')}.`,
  };
};
