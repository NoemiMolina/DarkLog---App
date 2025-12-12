import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Separator } from '../../components/ui/separator';
import { Heart, MessageCircle, Send, Trash2 } from 'lucide-react';
import { CommentItem } from './CommentItem';

interface Post {
    _id: string;
    author: { _id: string; username: string };
    title?: string;
    content: string;
    likes: any[];
    comments: any[];
    createdAt: string;
}

interface PostCardProps {
    post: Post;
    currentUserId: string;
    onDelete: (postId: string) => void;
    onLike: (postId: string) => void;
    onUpdate: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, currentUserId, onDelete, onLike, onUpdate }) => {
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const token = localStorage.getItem('token');

    const isLiked = Array.isArray(post.likes)
        ? post.likes.some((userId: any) => String(userId) === String(currentUserId))
        : false;
    const isAuthor = post.author?._id === currentUserId;

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const res = await fetch(`http://localhost:5000/forum/posts/${post._id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: newComment })
            });

            if (res.ok) {
                setNewComment('');
                onUpdate();
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleLikeComment = async (commentId: string, replyId?: string) => {
        try {
            const url = replyId
                ? `http://localhost:5000/forum/posts/${post._id}/comments/${commentId}/replies/${replyId}/reactions`
                : `http://localhost:5000/forum/posts/${post._id}/comments/${commentId}/reactions`;

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ type: 'like' })
            });

            if (res.ok) {
                onUpdate();
            }
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    return (
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-white text-base">{post.author?.username || 'User'}</CardTitle>
                            <CardDescription className="text-white/50 text-xs">
                                {new Date(post.createdAt).toLocaleDateString('en-US', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </CardDescription>
                        </div>
                    </div>
                    {isAuthor && (
                        <Button variant="ghost" size="icon" onClick={() => onDelete(post._id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/20">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {post.title && <h3 className="text-white font-bold text-xl mb-3">{post.title}</h3>}
                <p className="text-white/90 whitespace-pre-wrap">{post.content}</p>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
                <div className="flex gap-2 w-full">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onLike(post._id)}
                        className={`gap-2 ${isLiked ? 'bg-red-500/30 border-red-500/50 text-red-300 hover:bg-red-500/40' : 'bg-white/5 border-white/20 text-white hover:bg-white/10'}`}
                    >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        {Array.isArray(post.likes) ? post.likes.length : 0}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowComments(!showComments)} className="gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments?.length || 0}
                    </Button>
                </div>

                {showComments && (
                    <>
                        <Separator className="bg-white/20" />
                        <div className="w-full space-y-4">
                            <form onSubmit={handleAddComment} className="flex gap-2">
                                <Input
                                    placeholder="Write a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                                />
                                <Button type="submit" size="icon" disabled={!newComment.trim()} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90">
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>

                            {post.comments && post.comments.length > 0 && (
                                <div className="space-y-3">
                                    {post.comments.map(comment => (
                                        <CommentItem
                                            key={comment._id}
                                            comment={comment}
                                            postId={post._id}
                                            currentUserId={currentUserId}
                                            onLike={handleLikeComment}
                                            onUpdate={onUpdate}
                                            level={0}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </CardFooter>
        </Card>
    );
};