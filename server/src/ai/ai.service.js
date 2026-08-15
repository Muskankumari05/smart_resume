import Groq from 'groq-sdk';

/**
 * Safe JSON Extractor from LLM string output
 */
export const parseCleanJson = (rawText) => {
  if (typeof rawText === 'object' && rawText !== null) return rawText;
  if (!rawText || typeof rawText !== 'string') throw new Error('Empty AI response.');

  // Clean markdown backticks if present
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/```json/gi, '').replace(/```/g, '').trim();

  // Extract JSON string using regex object/array match
  const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('[AI Parse Clean JSON Error]:', err.message, 'Raw:', rawText);
    throw new Error('Failed to parse clean JSON from AI response.');
  }
};

/**
 * Main AI Prompt Dispatcher
 */
export const queryAI = async (prompt, systemPrompt = 'You are an expert HR, ATS and AI Recruitment Specialist. Always respond in valid JSON format.') => {
  const apiKey = process.env.GROQ_API_KEY;

  if (apiKey && apiKey !== 'gsk_demo_mock_key_or_user_key' && apiKey.startsWith('gsk_')) {
    try {
      const groq = new Groq({ apiKey });
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.2,
        response_format: { type: 'json_object' },
      });

      const content = completion.choices[0]?.message?.content;
      return parseCleanJson(content);
    } catch (error) {
      console.warn(`[Groq AI API Call Failed]: ${error.message}. Falling back to smart rule-based parser.`);
    }
  }

  // If no Groq API Key or call failed, return null to trigger smart fallback handlers
  return null;
};
