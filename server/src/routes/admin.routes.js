import express from 'express';
import { getUsers, updateUserRole, getSystemStats } from '../controllers/admin.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);
router.get('/stats', getSystemStats);

export default router;
