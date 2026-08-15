import express from 'express';
import { createJob, getJobs, getJobById, updateJob, deleteJob } from '../controllers/job.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createJob)
  .get(protect, getJobs);

router.route('/:id')
  .get(protect, getJobById)
  .put(protect, updateJob)
  .delete(protect, deleteJob);

export default router;
