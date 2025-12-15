import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Send, X } from 'lucide-react';

interface CreatePostCardProps {
    username: string;
    profilePic: string | null;
    onCreatePost: (title: string, content: string, tags?: string[]) => Promise<boolean>;
}

export const CreatePostCard: React.FC<CreatePostCardProps> = ({ username, profilePic, onCreatePost }) => {
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        console.log('🔑 Key pressed:', e.key, 'Input value:', tagInput);
        
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim().toLowerCase();
            if (!tags.includes(newTag) && tags.length < 5) {
                const updatedTags = [...tags, newTag];
                setTags(updatedTags);
                setTagInput('');
            } else {
                console.log('⚠️ Tag already exists or maximum tags reached');
            }
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostTitle.trim() || !newPostContent.trim()) return;
        console.log('📝 Creating post with tags:', tags);
        const success = await onCreatePost(newPostTitle, newPostContent, tags);
        console.log('✅ Post created successfully:', success);

        if (success) {
            setNewPostTitle('');
            setNewPostContent('');
            setTags([]);
            setTagInput('');
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
                                <div className="w-full h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-700 flex items-center justify-center text-white font-bold">
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
                    <div className="space-y-2">
                        <Input
                            placeholder="Add tags (press Enter)..."
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                            className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                            maxLength={20}
                        />
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        className="bg-violet-500/30 hover:bg-violet-500/40 text-white border-violet-500/50 cursor-pointer"
                                        onClick={() => handleRemoveTag(tag)}
                                    >
                                        #{tag}
                                        <X className="w-3 h-3 ml-1" />
                                    </Badge>
                                ))}
                            </div>
                        )}
                        <p className="text-xs text-white/40">
                            {tags.length}/5 tags • Press Enter to add
                        </p>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setNewPostContent('');
                                setNewPostTitle('');
                            }}
                            className="bg-gradient-to-r from-violet-700 to-violet-900 text-white border-purple-500/50 hover:opacity-90"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!newPostContent.trim() || !newPostTitle.trim()}
                            className="bg-gradient-to-r from-green-700 to-green-900  hover:opacity-90 border-green-500/50 "
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