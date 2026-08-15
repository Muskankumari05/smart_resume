import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ];

  const ext = file.originalname.split('.').pop().toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) || ['pdf', 'docx', 'doc'].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF (.pdf) and Word (.docx) files are supported.'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB per file limit
  },
});
