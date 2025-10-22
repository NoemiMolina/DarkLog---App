import type { Request, Response } from 'express';
import Forum from '../models/Forum.js';

const getUserId = (req: Request) => (req as any).userId || (req as any).user?.id || (req as any).user?._id;

export const createPost = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const { title, content, tags = [], published = false } = req.body;
        if (!title?.trim() || !content?.trim()) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const post = await Forum.create({
            author: userId,
            title: title.trim(),
            content: content.trim(),
            tags,
            published
        });

        res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
        res.status(500).json({ message: "Error creating post", error });
    }
};

export const publishPost = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const post = await Forum.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });
        if (post.author.toString() !== userId) {
            return res.status(403).json({ message: "Forbidden: You can only publish your own posts" });
        }

        post.published = true;
        await post.save();
        res.status(200).json({ message: "Post published successfully", post });
    } catch (error) {
        res.status(500).json({ message: "Error publishing post", error });
    }
};

export const updatePost = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ message: "Unauthorized" });
        const post = await Forum.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });
        if (post.author.toString() !== userId) {
            return res.status(403).json({ message: "Forbidden: You can only update your own posts" });
        }

        const { title, content, tags, published } = req.body;
        if (typeof title === 'string' && title.trim()) post.title = title.trim();
        if (typeof content === 'string' && content.trim()) post.content = content.trim();
        if (Array.isArray(tags)) post.tags = tags;
        if (typeof published === 'boolean') post.published = published;

        await post.save();
        res.status(200).json({ message: "Post updated successfully", post });
    } catch (error) {
        res.status(500).json({ message: "Error updating post", error });
    }
};

export const deletePost = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ message: "Unauthorized" });
        const post = await Forum.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });
        if (post.author.toString() !== userId) {
            return res.status(403).json({ message: "Forbidden: You can only delete your own posts" });
        }
        await post.deleteOne();
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting post", error });
    }
};

export const getPublishedPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Forum.find({ published: true }).sort({ createdAt: -1 }).populate('author', 'username');
        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts", error });
    }
};

export const getPost = async (req: Request, res: Response) => {
    try {
        const post = await Forum.findById(req.params.id)
            .populate('author', 'username avatar')
            .populate('comments.author', 'username avatar')
            .populate('comments.replies.author', 'username avatar');
        if (!post) return res.status(404).json({ message: "Post not found" });
        if (!post.published) {
            const userId = getUserId(req);
            if (!userId || post.author.toString() !== String(userId))
                return res.status(403).json({ message: 'Forbidden' });
        }

        return res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Error fetching post", error });
    }
};

export const addCommentToPost = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const { content } = req.body;
        if (!content.trim()) return res.status(400).json({ message: "Content is required" });

        const post = await Forum.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });
        if (!post.published && post.author.toString() !== String(userId)) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        post.comments.push({ author: userId, content: content.trim(), replies: [] } as any)
        await post.save()
        res.status(201).json({ message: "Comment added successfully", post })
    } catch (error) {
        res.status(500).json({ message: "Error adding comment", error })
    }
};

export const deleteCommentFromPost = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const { id, commentId } = req.params;
        if (!commentId) return res.status(400).json({ message: "commentId is required" });

        const post = await Forum.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const comment = post.comments.id(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        const isCommentAuthor = String(comment.author) === String(userId);
        const isPostAuthor = String(post.author) === String(userId);
        if (!isCommentAuthor && !isPostAuthor) {
            return res.status(403).json({ message: "Forbidden: You can only delete your own comments or comments on your posts" });
        }

        comment.deleteOne();
        await post.save();
        return res.json(post)
    } catch (error) {
        res.status(500).json({ message: "Error deleting comment", error });
    }
};

export const replyToComment = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const { id, commentId } = req.params;
        if (typeof commentId !== 'string' || !commentId.trim()) {
            return res.status(400).json({ message: "commentId is required" });
        }
        const commentIdStr = commentId.trim();

        const { content } = req.body;
        if (!content || !content.trim()) return res.status(400).json({ message: "Content is required" });

        const post = await Forum.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const comment = post.comments.id(commentIdStr);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        comment.replies.push({ author: userId, content: content.trim() } as any);
        await post.save();
        return res.status(201).json({ message: "Reply added successfully", post });
    } catch (error) {
        res.status(500).json({ message: "Error adding reply", error });
    }
};

export const addReactionToPost = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { type } = req.body as { type: 'like' | 'dislike' };
        if (!['like', 'dislike'].includes(String(type)))
            return res.status(400).json({ message: 'type must be like or dislike' });

        const post = await Forum.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const uid = String(userId);

        post.likes = post.likes.filter((u: any) => String(u) !== uid);
        post.dislikes = post.dislikes.filter((u: any) => String(u) !== uid);

        if (type === 'like') {
            const already = post.likes.some((u: any) => String(u) === uid);
            if (!already) post.likes.push(userId as any);
        } else {
            const already = post.dislikes.some((u: any) => String(u) === uid);
            if (!already) post.dislikes.push(userId as any);
        }

        await post.save();
        return res.json({
            likes: post.likes.length,
            dislikes: post.dislikes.length,
            post
        });
    } catch (err: any) {
        return res.status(500).json({ error: err.message || err });
    }
};

export const addReactionToComment = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId || (req as any).user?.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const { id, commentId } = req.params;
        // ensure commentId is a non-empty string so TS / Mongoose accept it
        if (typeof commentId !== 'string' || !commentId.trim()) {
            return res.status(400).json({ message: "commentId is required" });
        }
        const commentIdStr = commentId.trim();

        const { type } = req.body;

        if (!["like", "dislike"].includes(type)) {
            return res.status(400).json({ message: "Type must be 'like' or 'dislike'" });
        }

        const post = await Forum.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const comment: any = post.comments.id(commentIdStr);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        if (!comment.likes) comment.likes = [];
        if (!comment.dislikes) comment.dislikes = [];

        comment.likes = comment.likes.filter((uid: any) => String(uid) !== String(userId));
        comment.dislikes = comment.dislikes.filter((uid: any) => String(uid) !== String(userId));

        if (type === "like") comment.likes.push(userId);
        else comment.dislikes.push(userId);

        await post.save();

        return res.status(200).json({
            message: `Comment ${type}d successfully`,
            likes: comment.likes.length,
            dislikes: comment.dislikes.length,
            comment,
        });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ error: err.message || "Server error" });
    }
};

export const getPostsByTag = async (req: Request, res: Response) => {
    try {
        const tag = req.params.tag?.toLowerCase();
        if (!tag) return res.status(400).json({ message: "Tag parameter is required" });
        const posts = await Forum.find({ published: true, tags: tag }).sort({ createdAt: -1 }).populate('author', 'username');
        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts by tag", error });
    }
};