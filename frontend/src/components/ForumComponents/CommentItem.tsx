import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../../components/ui/card';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Heart, Reply, Send } from 'lucide-react';

interface Comment {
    _id: string;
    author: { _id: string; username?: string; UserPseudo?: string; UserProfilePicture?: string };
    content: string;
    likes: any[];
    replies: Comment[];
    createdAt: string;
}

interface CommentItemProps {
    comment: Comment;
    postId: string;
    currentUserId: string;
    onLike: (commentId: string, replyId?: string) => void;
    onUpdate: () => void;
    level: number;
    parentCommentId?: string;
}

export const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    postId,
    currentUserId,
    onLike,
    onUpdate,
    level,
    parentCommentId
}) => {
    const [showReply, setShowReply] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const token = localStorage.getItem('token');

    const isLiked = Array.isArray(comment.likes)
        ? comment.likes.some((userId: any) => String(userId) === String(currentUserId))
        : false;

    const isTopLevelComment = level === 0;
    const commentIdToUse = isTopLevelComment ? comment._id : parentCommentId;

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        try {
            const res = await fetch(`${API_URL}/forum/posts/${postId}/comments/${commentIdToUse}/replies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: replyContent })
            });

            if (res.ok) {
                setReplyContent('');
                setShowReply(false);
                onUpdate();
            }
        } catch (error) {
            console.error('Error adding reply:', error);
        }
    };

    return (
        <div className={`${level > 0 ? 'ml-8 mt-2' : ''}`} id={`comment-${commentIdToUse}`}>
            <Card className="bg-white/5 border-l-2 border-l-purple-500/50">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                            {comment.author?.UserProfilePicture && (
                                <img 
                                    src={
                                        comment.author.UserProfilePicture?.startsWith("http")
                                            ? comment.author.UserProfilePicture
                                            : `${API_URL}/${comment.author.UserProfilePicture}`
                                    }
                                    alt={comment.author?.UserPseudo}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            )}
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                                {comment.author?.UserPseudo?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-white text-sm font-medium">{comment.author?.UserPseudo || 'User'}</p>
                            <p className="text-white/50 text-xs">
                                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="py-2">
                    <p className="text-white/90 text-sm">{comment.content}</p>
                </CardContent>
                <CardFooter className="pt-2 pb-3 flex-col items-start gap-2">
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                if (isTopLevelComment) {
                                    onLike(comment._id);
                                } else {
                                    onLike(commentIdToUse!, comment._id);
                                }
                            }}
                            className={`h-7 gap-1 text-xs ${isLiked ? 'text-red-300 hover:text-red-200' : 'text-white/70 hover:text-white'}`}
                        >
                            <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                            {Array.isArray(comment.likes) ? comment.likes.length : 0}
                        </Button>
                        {level < 3 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowReply(!showReply)}
                                className="h-7 gap-1 text-xs text-white/70 hover:text-white"
                            >
                                <Reply className="w-3 h-3" />
                                Answer
                            </Button>
                        )}
                    </div>

                    {showReply && (
                        <form onSubmit={handleReply} className="flex gap-2 w-full mt-2">
                            <Input
                                placeholder="Write an answer..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                className="h-8 text-sm bg-white/5 border-white/20 text-white placeholder:text-white/50"
                            />
                            <Button type="submit" size="sm" disabled={!replyContent.trim()} className="h-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90">
                                <Send className="w-3 h-3" />
                            </Button>
                        </form>
                    )}
                </CardFooter>
            </Card>

            {comment.replies && comment.replies.length > 0 && (
                <div className="space-y-2 mt-2">
                    {comment.replies.map(reply => (
                        <CommentItem
                            key={reply._id}
                            comment={reply}
                            postId={postId}
                            currentUserId={currentUserId}
                            onLike={onLike}
                            onUpdate={onUpdate}
                            level={level + 1}
                            parentCommentId={commentIdToUse}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};