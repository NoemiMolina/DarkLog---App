import React, { useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import RatingSkulls from "./RatingSkulls";
import { API_URL } from "../../config/api";

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
  const [expandedReview, setExpandedReview] = useState<number | null>(null);

  useEffect(() => {
    fetchFriendReviews();
  }, []);

  const fetchFriendReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user._id;
      if (!userId) {
        console.warn(
          "⛔ fetchFriendReviews: userId is undefined, skipping API call.",
        );
        setLoading(false);
        return;
      }
      const response = await fetch(
        `${API_URL}/users/${userId}/friends-reviews`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setFriendReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("💥 Error fetching friend reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-400">Loading...</p>;
  }

  return (
    <section className="w-full px-4 py-6 mb-5 -mt-12 sm:mt-0 2xl:translate-y-[-50px] 2xl:translate-x-[168px] 2xl:max-w-[1550px]">
      <h2
        className="text-sm sm:text-xl font-bold text-white text-center mb-4"
        style={{ fontFamily: "'Metal Mania', serif" }}
      >
        Popular with friends
      </h2>
      <Separator className="bg-white/20 mb-4" />

      {friendReviews.length === 0 ? (
        <p className="text-center text-gray-400 mb-8">
          No recent activity from friends
        </p>
      ) : (
        <>
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
                        review.friendProfilePicture.startsWith("http")
                          ? review.friendProfilePicture
                          : `${API_URL}/${review.friendProfilePicture}`
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
                  <div className="flex items-center justify-center gap-0.5 mb-1 scale-50">
                    <RatingSkulls value={review.rating} onChange={() => {}} />
                  </div>
                  <p
                    onClick={() =>
                      setExpandedReview(expandedReview === index ? null : index)
                    }
                    className={`text-[0.6rem] text-gray-300 text-center cursor-pointer hover:text-purple-400 transition ${
                      expandedReview === index ? "" : "line-clamp-2"
                    }`}
                  >
                    {review.review}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {friendReviews.map((review, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-[#2A2A2A] rounded-lg"
              >
                {review.friendProfilePicture ? (
                  <img
                    src={
                      review.friendProfilePicture.startsWith("http")
                        ? review.friendProfilePicture
                        : `${API_URL}/${review.friendProfilePicture}`
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
                    <span className="font-semibold text-white">
                      {review.friendName}
                    </span>
                    <span className="text-gray-400 text-sm">reviewed</span>
                    <span className="font-medium text-white">
                      '{review.movieTitle}'
                    </span>
                    <span className="text-gray-400 text-sm">
                      {" "}
                      on {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    <div className="scale-75 origin-left">
                      <RatingSkulls value={review.rating} onChange={() => {}} />
                    </div>
                    <span className="text-gray-400 text-sm">:</span>
                  </div>

                  <div className="flex items-start gap-4">
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {" "}
                      {review.review}
                    </p>
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
