import React, { useEffect, useState } from 'react';
import { Separator } from './ui/separator';
import { Star } from 'lucide-react';

interface FriendReview {
    friendId: string;
    friendName: string;
    friendProfilePicture: string | null;
    movieTitle: string;
    movieId: number;
    review: string;
    rating: number;
    createdAt: string;
}

const PopularWFriendsSection: React.FC = () => {
    const [friendReviews, setFriendReviews] = useState<FriendReview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFriendReviews();
    }, []);

    const fetchFriendReviews = async () => {
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = user._id;

            const response = await fetch(`http://localhost:5000/users/${userId}/friends-reviews`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setFriendReviews(data.reviews || []);
            }
        } catch (error) {
            console.error('Error fetching friend reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p className="text-center text-gray-400">Loading...</p>;
    }

    return (
        <section className="w-full px-4 py-6">
            <h2 className="text-xl font-bold text-white translate-y-[-110px] text-center">Popular with friends</h2>
            <Separator className="bg-white/20 mb-6 translate-y-[-95px]" />
            
            {friendReviews.length === 0 ? (
                <p className="text-center text-gray-400 translate-y-[-95px]">No recent activity from friends</p>
            ) : (
                <div className="space-y-4">
                    {friendReviews.map((review, index) => (
                        <div 
                            key={index} 
                            className="flex items-center gap-4 p-4 bg-[#2A2A2A] rounded-lg"
                        >
                            {review.friendProfilePicture ? (
                                <img
                                    src={
                                        review.friendProfilePicture.startsWith('http')
                                            ? review.friendProfilePicture
                                            : `http://localhost:5000/${review.friendProfilePicture}`
                                    }
                                    alt={review.friendName}
                                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-semibold">
                                        {review.friendName.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="font-semibold text-white">{review.friendName}</span>
                                    <span className="text-gray-400 text-sm">reviewed</span>
                                    <span className="font-medium text-white">{review.movieTitle}</span>
                                </div>
                                <p className="text-sm text-gray-300 line-clamp-2">{review.review}</p>
                            </div>
                            <div className="flex items-center gap-1 text-yellow-400 flex-shrink-0">
                                <Star className="w-5 h-5 fill-yellow-400" />
                                <span className="font-bold text-lg">{review.rating}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default PopularWFriendsSection;