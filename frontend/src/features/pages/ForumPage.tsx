import React, { useState, useEffect } from "react";
import Header from "../../components/HeaderComponents/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { CreatePostCard } from "../../components/ForumComponents/CreatePostCard";
import { PostCard } from "../../components/ForumComponents/PostCard";
import { useForumData } from "../../components/ForumComponents/hooks/useForumData";

export const ForumPage: React.FC = () => {
    const [username, setUsername] = useState<string>("Guest");
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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

    return (
        <main className="min-h-screen relative">
            <Header username={username} userProfilePicture={profilePic} />
            <section className="py-8 px-4 max-w-4xl mx-auto">
                <div className="space-y-6">
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-bold text-white mb-2">Forum</h1>
                        <p className="text-white/70">Share your opinions about the horror genre and discuss with the community</p>
                    </div>

                    <CreatePostCard username={username} profilePic={profilePic} onCreatePost={createPost} />

                    {loading ? (
                        <div className="text-center text-white py-12">
                            <p className="text-xl">Loading...</p>
                        </div>
                    ) : posts.length === 0 ? (
                        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                            <CardContent className="py-12 text-center">
                                <p className="text-white/70 text-lg">No posts yet.</p>
                                <p className="text-white/50 mt-2">Be the first to post!</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {posts.map(post => (
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