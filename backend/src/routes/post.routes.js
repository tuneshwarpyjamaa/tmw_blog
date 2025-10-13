import { Router } from 'express';
import { listPosts, getPost, createPost, updatePost, deletePost } from '../controllers/post.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', listPosts);
router.get('/:slug', getPost);
router.post('/', requireAuth, createPost);
router.put('/:id', requireAuth, updatePost);
router.delete('/:id', requireAuth, deletePost);

export default router;
