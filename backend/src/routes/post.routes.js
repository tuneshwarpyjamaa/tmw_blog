import { Router } from 'express';
import multer from 'multer';
import { listPosts, getPost, createPost, updatePost, deletePost, createPostFromPdf } from '../controllers/post.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', listPosts);
router.get('/:slug', getPost);
router.post('/', requireAuth, authorize('managePosts'), createPost);
router.post('/upload/pdf', requireAuth, authorize('managePosts'), upload.single('file'), createPostFromPdf);
router.put('/:id', requireAuth, authorize('managePosts'), updatePost);
router.delete('/:id', requireAuth, authorize('managePosts'), deletePost);

export default router;
