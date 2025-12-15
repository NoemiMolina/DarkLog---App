import React, { useMemo } from 'react';
import { Badge } from '../ui/badge';

interface TagFilterProps {
    onTagClick: (tag: string) => void;
    selectedTag: string | null;
    posts: any[];
}

const POPULAR_TAGS = [
    { name: 'movies', icon: '#', color: 'bg-red-500/20 hover:bg-red-500/40 border-red-500/50' },
    { name: 'tv-shows', icon: '#', color: 'bg-red-500/20 hover:bg-red-500/40 border-red-500/50' },
    { name: 'books', icon: '#', color: 'bg-red-500/20 hover:bg-red-500/40 border-red-500/50' },
    { name: 'horror', icon: '#', color: 'bg-red-500/20 hover:bg-red-500/40 border-red-500/50' },
    { name: 'screaming queens', icon: '#', color: 'bg-red-500/20 hover:bg-red-500/40 border-red-500/50' },
    { name: 'recent', icon: '#', color: 'bg-red-500/20 hover:bg-red-500/40 border-red-500/50' },
    { name: 'classics', icon: '#', color: 'bg-red-500/20 hover:bg-red-500/40 border-red-500/50' },
    { name: 'thriller', icon: '#', color: 'bg-red-500/20 hover:bg-red-500/40 border-red-500/50' },
    { name: 'psychological', icon: '#', color: 'bg-red-500/20 hover:bg-red-500/40 border-red-500/50' },
    { name: 'slasher', icon: '#', color: 'bg-red-500/20 hover:bg-red-500/40 border-red-500/50' },
    { name: 'supernatural', icon: '#', color: 'bg-red-500/20 hover:bg-red-500/40 border-red-500/50' },
    { name: 'zombies', icon: '#', color: 'bg-red-500/20 hover:bg-red-500/40 border-red-500/50' },
    { name: 'vampires', icon: '#', color: 'bg-red-500/20 hover:bg-red-500/40 border-red-500/50' },
    { name: 'werewolves', icon: '#', color: 'bg-red-500/20 hover:bg-red-500/40 border-red-500/50' },

];

export const TagFilter: React.FC<TagFilterProps> = ({ onTagClick, selectedTag, posts }) => {
    const allTags = useMemo(() => {
        const tagsSet = new Set<string>();
        POPULAR_TAGS.forEach(tag => tagsSet.add(tag.name));
        posts.forEach(post => {
            if (post.tags && Array.isArray(post.tags)) {
                post.tags.forEach((tag: string) => tagsSet.add(tag.toLowerCase()));
            }
        });

        return Array.from(tagsSet);
    }, [posts]);

    return (
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <span className="text-white/70 text-sm font-medium">Popular tags:</span>

            {allTags.map((tagName) => (
                <Badge
                    key={tagName}
                    onClick={() => onTagClick(tagName)}
                    className={`cursor-pointer transition-all duration-200 bg-red-500/20 hover:bg-red-500/40 border-red-500/50
            ${selectedTag === tagName ? 'ring-2 ring-white/50 scale-110' : ''}
            text-white font-medium px-4 py-2 text-sm`}
                >
                    <span className="mr-2">#</span>
                    {tagName}
                </Badge>
            ))}

            {selectedTag && (
                <Badge
                    onClick={() => onTagClick('')}
                    className="cursor-pointer bg-gray-500/20 hover:bg-gray-500/40 border-gray-500/50 text-white font-medium px-4 py-2 text-sm"
                >
                    ✕ Clear filter
                </Badge>
            )}
        </div>
    );
};