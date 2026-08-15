/**
 * Feature vector generator and Cosine Similarity service.
 * Converts text into normalized TF-IDF term frequency vectors and calculates cosine similarity.
 */

// Global vocabulary dictionary for consistent vector dimensionality
const createVocabulary = (text1, text2) => {
  const words = (text1 + ' ' + text2)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);

  return Array.from(new Set(words));
};

export const generateEmbedding = (text) => {
  if (!text) return [];

  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);

  // Map term frequencies
  const freqMap = {};
  tokens.forEach((token) => {
    freqMap[token] = (freqMap[token] || 0) + 1;
  });

  // Return key frequency entries as lightweight embedding vector representation
  const vector = [];
  const entries = Object.entries(freqMap).slice(0, 128); // 128 dimensions max
  entries.forEach(([_, count]) => {
    vector.push(Number((count / tokens.length).toFixed(4)));
  });

  // Pad to fixed length if necessary
  while (vector.length < 64) {
    vector.push(0.0);
  }

  return vector;
};

export const calculateCosineSimilarity = (text1, text2) => {
  if (!text1 || !text2) return 0;

  const vocab = createVocabulary(text1, text2);
  if (vocab.length === 0) return 0;

  const tokenize = (text) => {
    const tokens = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/);
    const map = {};
    tokens.forEach((t) => (map[t] = (map[t] || 0) + 1));
    return map;
  };

  const map1 = tokenize(text1);
  const map2 = tokenize(text2);

  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  vocab.forEach((term) => {
    const val1 = map1[term] || 0;
    const val2 = map2[term] || 0;

    dotProduct += val1 * val2;
    magnitude1 += val1 * val1;
    magnitude2 += val2 * val2;
  });

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) return 0;

  const similarity = dotProduct / (magnitude1 * magnitude2);
  return Math.min(100, Math.max(0, Math.round(similarity * 100)));
};
