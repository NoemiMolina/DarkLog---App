import { useState, useEffect } from 'react';

interface Post {
    _id: string;
    author: any;
    title?: string;
    content: string;
    likes: any[];
    comments: any[];
    createdAt: string;
}

export const useForumData = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    const loadPosts = async () => {
        try {
            const res = await fetch('http://localhost:5000/forum/posts/published', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPosts(data.posts || []);
            }
        } catch (error) {
            console.error('Error loading posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const createPost = async (title: string, content: string, tags: string[] = []) => {
        try {
            const res = await fetch('http://localhost:5000/forum/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, content, tags,published: true })
            });
            if (res.ok) {
                await loadPosts();
                return true;
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
        return false;
    };

    const deletePost = async (postId: string) => {
        try {
            const res = await fetch(`http://localhost:5000/forum/posts/${postId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setPosts(posts.filter(p => p._id !== postId));
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const likePost = async (postId: string) => {
        try {
            const res = await fetch(`http://localhost:5000/forum/posts/${postId}/reaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ type: 'like' })
            });
            if (res.ok) {
                const data = await res.json();
                setPosts(posts.map(p => p._id === postId ? data.post : p));
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    useEffect(() => {
        const userToken = localStorage.getItem("token");
        if (userToken) {
            loadPosts();
        } else {
            setLoading(false);
        }
    }, []);

    return { posts, loading, loadPosts, createPost, deletePost, likePost };
};