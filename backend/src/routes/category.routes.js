import { Router } from 'express';
import { listCategories, getPostsByCategory } from '../controllers/category.controller.js';

const router = Router();

router.get('/', listCategories);
router.get('/:slug/posts', getPostsByCategory);

export default router;
