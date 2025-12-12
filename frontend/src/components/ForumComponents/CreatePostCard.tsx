import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Send } from 'lucide-react';

interface CreatePostCardProps {
    username: string;
    profilePic: string | null;
    onCreatePost: (title: string, content: string) => Promise<boolean>;
}

export const CreatePostCard: React.FC<CreatePostCardProps> = ({ username, profilePic, onCreatePost }) => {
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostTitle.trim() || !newPostContent.trim()) return;

        const success = await onCreatePost(newPostTitle, newPostContent);
        if (success) {
            setNewPostTitle('');
            setNewPostContent('');
        }
    };

    return (
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            {profilePic ? (
                                <img src={profilePic} alt={`${username}'s profile`} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                    {username.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-white text-lg">{username}</CardTitle>
                        <CardDescription className="text-white/60">Share your thoughts</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Title of your post..."
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        maxLength={180}
                    />
                    <Textarea
                        placeholder="What's new?"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="min-h-[120px] bg-white/5 border-white/20 text-white placeholder:text-white/50 resize-none"
                        maxLength={1000}
                    />
                    <div className="flex gap-2 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setNewPostContent('');
                                setNewPostTitle('');
                            }}
                            className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!newPostContent.trim() || !newPostTitle.trim()}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                        >
                            <Send className="w-4 h-4 mr-2" />
                            Publish
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};