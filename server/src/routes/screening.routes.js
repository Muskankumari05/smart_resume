import express from 'express';
import { screenCandidate, screenAllForJob, getJobScreenings, updateApplicationStatus } from '../controllers/screening.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/:jobId/screen-all', protect, screenAllForJob);
router.post('/:jobId/:candidateId', protect, screenCandidate);
router.get('/:jobId', protect, getJobScreenings);
router.patch('/status/:id', protect, updateApplicationStatus);

export default router;
