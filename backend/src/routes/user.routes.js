import { Router } from 'express';
import { getAllUsers, updateUserRole } from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { checkRole } from '../middleware/rbac.js';

const router = Router();

router.get('/', requireAuth, checkRole('admin'), getAllUsers);
router.put('/:id/role', requireAuth, checkRole('admin'), updateUserRole);

export default router;