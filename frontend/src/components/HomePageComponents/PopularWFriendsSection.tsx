import React, { useEffect, useState } from 'react';
import { Separator } from '../ui/separator';
import { Star } from 'lucide-react';

interface FriendReview {
    friendId: string;
    friendName: string;
    friendProfilePicture: string | null;
    movieTitle: string;
    moviePosterPath: string | null;
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
            console.error('💥 Error fetching friend reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p className="text-center text-gray-400">Loading...</p>;
    }

    return (
        <section className="w-full px-4 py-6 mb-5 -mt-12 sm:mt-0 xl:translate-y-[-50px] xl:translate-x-[168px] xl:max-w-[1550px]">
            <h2 className="text-sm sm:text-xl font-bold text-white text-center mb-4">Popular with friends</h2>
            <Separator className="bg-white/20 mb-4" />

            {friendReviews.length === 0 ? (
                <p className="text-center text-gray-400 mb-8">No recent activity from friends</p>
            ) : (
                <>
                  {/* Mobile: Horizontal scroll */}
                  <div className="mb-3 sm:hidden overflow-x-auto pb-2 -mx-4 px-4">
                    <div className="flex gap-3 w-max">
                      {friendReviews.map((review, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center p-2 bg-[#2A2A2A] rounded-lg w-24 flex-shrink-0"
                        >
                            {review.friendProfilePicture ? (
                                <img
                                    src={
                                        review.friendProfilePicture.startsWith('http')
                                            ? review.friendProfilePicture
                                            : `http://localhost:5000/${review.friendProfilePicture}`
                                    }
                                    alt={review.friendName}
                                    className="w-8 h-8 rounded-full object-cover mb-1"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mb-1">
                                    <span className="text-white font-semibold text-xs">
                                        {review.friendName.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <p className="text-[0.65rem] text-white font-semibold text-center line-clamp-2 mb-1">
                              '{review.movieTitle}'
                            </p>
                            <div className="flex items-center gap-0.5 mb-1">
                              <Star className="w-2.5 h-2.5 fill-yellow-400" />
                              <span className="text-[0.6rem] font-bold text-white">{review.rating}</span>
                            </div>
                            <p className="text-[0.6rem] text-gray-300 text-center line-clamp-2">
                              {review.review}
                            </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Desktop: Grid */}
                  <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                    {friendReviews.map((review, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-4 p-4 bg-[#2A2A2A] rounded-lg"
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
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <span className="font-semibold text-white">{review.friendName}</span>
                                    <span className="text-gray-400 text-sm">reviewed</span>
                                    <span className="font-medium text-white">'{review.movieTitle}'</span>
                                    <span className="text-gray-400 text-sm"> on {new Date(review.createdAt).toLocaleDateString()}</span>
                                     (<Star className="w-4 h-4 fill-yellow-400" />
                                    <span className="font-bold">{review.rating} ) :</span>
                                </div>

                                <div className="flex items-start gap-4">
                                    <p className="text-sm text-gray-300 line-clamp-2"> {review.review}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                  </div>
                </>
            )}
            <Separator className="bg-white/20 -mb-8 sm:mb-6" />
        </section>
    );
};

export default PopularWFriendsSection;