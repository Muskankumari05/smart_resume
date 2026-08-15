import pdfParse from 'pdf-parse';

export const parsePdf = async (fileBuffer) => {
  try {
    const data = await pdfParse(fileBuffer);
    if (!data.text || data.text.trim().length === 0) {
      throw new Error('PDF file appears to be empty or contains scanned image without OCR text.');
    }
    return data.text.trim();
  } catch (error) {
    console.error('[PDF Parser Error]:', error.message);
    throw new Error(`Failed to extract text from PDF file: ${error.message}`);
  }
};
