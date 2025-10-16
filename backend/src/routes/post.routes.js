import { Router } from 'express';
import { listPosts, getPost, createPost, updatePost, deletePost } from '../controllers/post.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { checkRole } from '../middleware/rbac.js';

const router = Router();

router.get('/', listPosts);
router.get('/:slug', getPost);
router.post('/', requireAuth, checkRole(['admin', 'editor', 'contributor']), createPost);
router.put('/:id', requireAuth, checkRole(['admin', 'editor', 'contributor']), updatePost);
router.delete('/:id', requireAuth, checkRole(['admin', 'editor']), deletePost);

export default router;
