import { queryAI } from './ai.service.js';

export const generateInterviewQuestions = async (job, candidate, missingSkills = []) => {
  const prompt = `
Generate tailored interview questions for evaluating candidate "${candidate.name}" for position "${job.title}".

Candidate Skills: ${candidate.skills.join(', ')}
Candidate Projects: ${candidate.projects.map((p) => p.name).join(', ')}
Job Required Skills: ${job.requiredSkills.join(', ')}
Missing Skills: ${missingSkills.join(', ')}

Return ONLY JSON with this structure:
{
  "technicalQuestions": [
    { "question": "Question text", "evaluationCriteria": "What to look for in response" }
  ],
  "behavioralQuestions": [
    { "question": "Question text", "evaluationCriteria": "What to look for in response" }
  ],
  "projectQuestions": [
    { "question": "Question text", "evaluationCriteria": "What to look for in response" }
  ],
  "skillGapQuestions": [
    { "question": "Question text", "evaluationCriteria": "What to look for in response" }
  ]
}

Provide EXACTLY:
- 5 Technical Questions
- 3 Behavioral Questions
- 3 Project Questions
- 3 Skill Gap Questions
`;

  try {
    const aiResult = await queryAI(prompt);

    if (aiResult && Array.isArray(aiResult.technicalQuestions) && aiResult.technicalQuestions.length > 0) {
      return aiResult;
    }
  } catch (err) {
    console.warn('[Interview Generator AI Fallback Triggered]:', err.message);
  }

  // Fallback Structured Question Generator
  const topSkill = candidate.skills[0] || 'software architecture';
  const secondSkill = candidate.skills[1] || 'database management';
  const missingSkill = missingSkills[0] || 'cloud deployment / CI/CD';
  const projName = candidate.projects[0]?.name || 'key application';

  return {
    technicalQuestions: [
      {
        question: `Explain how you implement best practices in ${topSkill} for production-grade applications.`,
        evaluationCriteria: `Candidate should demonstrate deep core principles, performance optimization, and error handling in ${topSkill}.`,
      },
      {
        question: `How do you handle asynchronous operations, state management, and memory leaks in ${topSkill}?`,
        evaluationCriteria: `Look for understanding of async control flows, data flow architectural patterns, and debugging tools.`,
      },
      {
        question: `Compare ${topSkill} with alternative frameworks/libraries in terms of performance and developer experience.`,
        evaluationCriteria: `Evaluates candidate's trade-off analysis and architectural decision making.`,
      },
      {
        question: `Describe your strategy for schema design, indexing, and query performance tuning in ${secondSkill}.`,
        evaluationCriteria: `Check for knowledge of indexing, normalization vs denormalization, and execution plan optimization.`,
      },
      {
        question: `How do you ensure API security, rate limiting, and input validation when building backend services?`,
        evaluationCriteria: `Verify knowledge of OWASP standards, JWT/OAuth tokens, sanitization, and CORS headers.`,
      },
    ],
    behavioralQuestions: [
      {
        question: `Describe a scenario where a critical production bug occurred. How did you diagnose, resolve, and communicate it?`,
        evaluationCriteria: `Look for calm problem-solving under pressure, blameless post-mortems, and proactive monitoring setup.`,
      },
      {
        question: `Tell me about a time when you disagreed with a senior tech lead or product owner on a feature design.`,
        evaluationCriteria: `Evaluates communication skills, empathy, objective data-driven reasoning, and collaboration.`,
      },
      {
        question: `How do you prioritize competing deadlines when managing technical debt versus delivering business features?`,
        evaluationCriteria: `Assess pragmatic decision making, trade-off communication, and agile iterative refactoring.`,
      },
    ],
    projectQuestions: [
      {
        question: `Walk us through the architecture and data flow of your project "${projName}".`,
        evaluationCriteria: `Candidate should clearly explain frontend-backend communication, database queries, and system boundaries.`,
      },
      {
        question: `What was the most challenging technical roadblock you encountered while building "${projName}" and how did you overcome it?`,
        evaluationCriteria: `Look for technical depth, perseverance, root-cause investigation, and testing strategies.`,
      },
      {
        question: `If you were to rebuild "${projName}" today for 10x the traffic, what changes would you make?`,
        evaluationCriteria: `Tests scalability mindset, caching strategies, load balancing, and database sharding/replication.`,
      },
    ],
    skillGapQuestions: [
      {
        question: `The job role requires experience with ${missingSkill}, which is not highlighted on your resume. What is your familiarity with it?`,
        evaluationCriteria: `Assess candidate's honesty, transferable skills, and willingness to learn missing technologies quickly.`,
      },
      {
        question: `Have you worked with any complementary tools or concepts similar to ${missingSkill}?`,
        evaluationCriteria: `Look for conceptual mastery and how quickly they pick up new frameworks or tools.`,
      },
      {
        question: `Walk us through your approach to mastering a completely new technology stack like ${missingSkill} within 30 days on the job.`,
        evaluationCriteria: `Evaluates self-directed learning ability, documentation reading, and sandbox experimentation.`,
      },
    ],
  };
};
