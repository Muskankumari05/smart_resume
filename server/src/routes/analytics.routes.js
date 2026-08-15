import express from 'express';
import { getDashboardAnalytics, getJobAnalytics } from '../controllers/analytics.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/dashboard', protect, getDashboardAnalytics);
router.get('/job/:jobId', protect, getJobAnalytics);

export default router;
