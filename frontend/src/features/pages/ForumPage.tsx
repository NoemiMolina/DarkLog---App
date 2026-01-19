import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/HeaderComponents/Header";
import { ForumNotificationBell } from "../../components/ForumNotificationBell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { CreatePostCard } from "../../components/ForumComponents/CreatePostCard";
import { PostCard } from "../../components/ForumComponents/PostCard";
import { TagFilter } from "../../components/ForumComponents/TagFilter";
import { useForumData } from "../../components/ForumComponents/hooks/useForumData";

export const ForumPage: React.FC = () => {
    const location = useLocation();
    const [username, setUsername] = useState<string>("Guest");
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
    const [isLoadingTag, setIsLoadingTag] = useState(false);

    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    const { posts, loading, loadPosts, createPost, deletePost, likePost } = useForumData();

    useEffect(() => {
        const rawUser = localStorage.getItem("user");
        if (rawUser) {
            try {
                const parsed = JSON.parse(rawUser);
                const userPseudo = parsed.UserPseudo || parsed.username || parsed.UserFirstName || "Guest";
                setUsername(userPseudo);

                if (parsed.UserProfilePicture) {
                    const fullPath = parsed.UserProfilePicture.startsWith("http")
                        ? parsed.UserProfilePicture
                        : `http://localhost:5000/${parsed.UserProfilePicture}`;
                    setProfilePic(fullPath);
                }
            } catch {
                setUsername("Guest");
            }
        }
    }, []);

    useEffect(() => {
        const userToken = localStorage.getItem("token");
        setIsLoggedIn(!!userToken);
    }, []);

    // Scroll to comment if coming from notification
    useEffect(() => {
        if (location.state?.commentId) {
            setTimeout(() => {
                const commentElement = document.getElementById(`comment-${location.state.commentId}`);
                if (commentElement) {
                    commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    commentElement.classList.add('highlight');
                }
            }, 500);
        } else if (location.state?.postId) {
            // If coming from notification with just postId, scroll to that post
            setTimeout(() => {
                const postElement = document.getElementById(`post-${location.state.postId}`);
                if (postElement) {
                    postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 500);
        }
    }, [location.state?.commentId, location.state?.postId]);

     useEffect(() => {
        if (!selectedTag) {
            setFilteredPosts(posts);
            setIsLoadingTag(false);
            return;
        }

        const fetchPostsByTag = async () => {
            setIsLoadingTag(true); 
            try {
                const response = await fetch(`http://localhost:5000/forum/posts/tags/${encodeURIComponent(selectedTag)}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log('📌 Posts by tag:', data.posts);
                    setFilteredPosts(data.posts || []);
                } else {
                    setFilteredPosts([]);
                }
            } catch (error) {
                console.error('Error fetching posts by tag:', error);
                setFilteredPosts([]);
            } finally {
                setIsLoadingTag(false);
            }
        };

        fetchPostsByTag();
    }, [selectedTag, posts]); 

    const handleTagClick = (tag: string) => {
        if (tag === selectedTag || tag === '') {
            setSelectedTag(null);
        } else {
            setSelectedTag(tag);
            setTimeout(() => {
                const firstPost = document.querySelector('[id^="post-"]');
                if (firstPost) {
                    firstPost.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
    };

    if (!isLoggedIn || !user) {
        return (
            <main className="min-h-screen relative">
                <Header onLogOut={handleLogout} />
                <section className="flex items-center justify-center min-h-[80vh]">
                    <Card className="w-[400px] bg-white/10 backdrop-blur-lg border-white/20">
                        <CardHeader>
                            <CardTitle className="text-white">Access restricted</CardTitle>
                            <CardDescription className="text-white/70">
                                You must be logged in to access the forum.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </section>
            </main>
        );
    }

    const isDisplayLoading = loading || isLoadingTag;

    return (
        <main className="min-h-screen relative">
            <Header username={username} userProfilePicture={profilePic} />
            <section className="py-8 px-4 max-w-4xl mx-auto">
                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-center flex-1">
                            <h1 className="text-5xl font-bold text-white mb-2" style={{ fontFamily: "'Metal Mania', serif" }}>The Crypt</h1>
                            <p className="text-white/70">Share your opinions about the horror genre and discuss with the community</p>
                        </div>
                        <div className="ml-4">
                            <ForumNotificationBell />
                        </div>
                    </div>

                    <TagFilter onTagClick={handleTagClick} selectedTag={selectedTag} posts={posts} />
                    {selectedTag && (
                        <div className="text-center mb-2">   
                            <p className="text-white/60 text-sm">
                                <span className="text-white font-semibold">#{selectedTag}</span>
                            </p>
                        </div>
                    )}

                    <CreatePostCard username={username} profilePic={profilePic} onCreatePost={createPost} />

                    {isDisplayLoading ? (
                        <div className="text-center text-white py-8">
                            <p className="text-xl">Loading...</p>
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                            <CardContent className="py-8 text-center">
                                <p className="text-white/70 text-lg">
                                    {selectedTag ? `No posts found with tag "${selectedTag}"` : 'No posts yet.'}
                                </p>
                                <p className="text-white/50 mt-2">
                                    {selectedTag ? 'Try another tag!' : 'Be the first to post!'}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filteredPosts.map(post => (
                                <PostCard
                                    key={post._id}
                                    post={post}
                                    currentUserId={user._id}
                                    onDelete={deletePost}
                                    onLike={likePost}
                                    onUpdate={loadPosts}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default ForumPage;