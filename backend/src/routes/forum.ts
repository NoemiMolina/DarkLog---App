import { Router } from 'express';
import { authMiddleware } from "../middleware/authMiddleware";
import {
    createPost,
    publishPost, // user publish a post
    updatePost,
    deletePost,
    getPublishedPosts, // get all published posts
    getPost, // get a single post by id
    addCommentToPost,
    deleteCommentFromPost,
    replyToComment,
    addReactionToPost,
    addReactionToComment,
    getPostsByTag,

} from '../controllers/forumController';


const router = Router();

router.post('/posts', authMiddleware, createPost); // ok
router.put('/posts/:id/publish', authMiddleware, publishPost); // ok
router.put('/posts/:id', authMiddleware, updatePost); // ok
router.delete('/posts/:id', authMiddleware, deletePost); // ok
router.get('/posts/published', getPublishedPosts); //ok
router.get('/posts/:id', getPost); // ok
router.post('/posts/:id/comments', authMiddleware, addCommentToPost); // ok
router.delete('/posts/:id/comments/:commentId', authMiddleware, deleteCommentFromPost); // ok
router.post('/posts/:id/comments/:commentId/replies', authMiddleware, replyToComment); // ok
router.post('/posts/:id/comments/:commentId/reactions', authMiddleware, addReactionToComment); //ok 
router.post('/posts/:id/reaction', authMiddleware, addReactionToPost,); // ok
router.get('/posts/tags/:tag', getPostsByTag); // ok

export default router;

