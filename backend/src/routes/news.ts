import { Router } from 'express';

import { getAllNews, getNewsBySlug } from '../controllers/newsController';

const router = Router();

router.get('/', getAllNews);
router.get('/news/:slug', getNewsBySlug);

export default router;