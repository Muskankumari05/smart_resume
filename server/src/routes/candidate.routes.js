import express from 'express';
import { uploadResumes, getCandidates, getCandidateById, deleteCandidate } from '../controllers/candidate.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.post('/upload', protect, upload.array('resumes', 100), uploadResumes);
router.get('/', protect, getCandidates);
router.get('/:id', protect, getCandidateById);
router.delete('/:id', protect, deleteCandidate);

export default router;
