import { Router } from 'express';
import { listCategories, getPostsByCategory, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { checkRole } from '../middleware/rbac.js';

const router = Router();

router.get('/', listCategories);
router.get('/:slug/posts', getPostsByCategory);
router.post('/', requireAuth, checkRole(['admin', 'editor']), createCategory);
router.put('/:id', requireAuth, checkRole(['admin', 'editor']), updateCategory);
router.delete('/:id', requireAuth, checkRole(['admin', 'editor']), deleteCategory);

export default router;
