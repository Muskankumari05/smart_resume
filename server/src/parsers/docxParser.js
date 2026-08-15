import mammoth from 'mammoth';

export const parseDocx = async (fileBuffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    if (!result.value || result.value.trim().length === 0) {
      throw new Error('DOCX document appears to be empty or contains non-extractable elements.');
    }
    return result.value.trim();
  } catch (error) {
    console.error('[DOCX Parser Error]:', error.message);
    throw new Error(`Failed to extract text from DOCX file: ${error.message}`);
  }
};
