import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import useDocumentTitle from "../hooks/useDocumentTitle";

import { capitialize } from "../lib/utils";

import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  useDocumentTitle("Home");
  
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-primary/5 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-12 max-w-7xl">
        {/* Hero Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-base-100/80 backdrop-blur-sm p-8 rounded-3xl border border-primary/10 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Your Friends 👥
                </h1>
                <p className="text-lg text-base-content/70 max-w-2xl">
                  Connect, practice, and grow together with your language learning partners
                </p>
              </div>
              <Link 
                to="/notifications" 
                className="btn btn-outline btn-lg rounded-2xl border-2 hover:scale-105 hover:shadow-lg transition-all duration-300 group"
              >
                <UsersIcon className="mr-3 size-5 group-hover:rotate-12 transition-transform duration-300" />
                Friend Requests
              </Link>
            </div>
          </div>
        </div>

        {/* Friends Section */}
        <section className="space-y-6">
          {loadingFriends ? (
            <div className="flex justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <span className="loading loading-spinner loading-lg text-primary" />
                <p className="text-base-content/70">Loading your friends...</p>
              </div>
            </div>
          ) : friends.length === 0 ? (
            <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl border border-primary/10 shadow-lg">
              <NoFriendsFound />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {friends.map((friend, index) => (
                <div 
                  key={friend._id}
                  className="transform hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <FriendCard friend={friend} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Discover Section */}
        <section className="space-y-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 via-transparent to-accent/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-base-100/80 backdrop-blur-sm p-8 rounded-3xl border border-secondary/10 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-3">
                  <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent">
                    Meet New Learners 🌟
                  </h2>
                  <p className="text-lg text-base-content/70 max-w-2xl">
                    Discover perfect language exchange partners based on your interests and learning goals
                  </p>
                </div>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <span className="loading loading-spinner loading-lg text-secondary" />
                <p className="text-base-content/70">Finding amazing language partners...</p>
              </div>
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl border border-secondary/10 shadow-lg p-12 text-center">
              <div className="space-y-4">
                <div className="text-6xl">🔍</div>
                <h3 className="font-bold text-2xl text-base-content">No recommendations available</h3>
                <p className="text-base-content/70 text-lg">
                  Check back later for new amazing language partners to connect with!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedUsers.map((user, index) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="group relative bg-base-100/80 backdrop-blur-sm rounded-3xl border border-base-300/50 hover:border-secondary/30 shadow-lg hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-500 hover:scale-[1.02] overflow-hidden"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative p-6 space-y-6">
                      {/* User Info */}
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="avatar size-16 rounded-2xl overflow-hidden ring-4 ring-secondary/20 group-hover:ring-secondary/40 transition-all duration-300">
                            <img src={user.profilePic} alt={user.fullName} className="w-full h-full object-cover" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-base-100 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-xl text-base-content truncate group-hover:text-secondary transition-colors duration-300">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-sm text-base-content/60 mt-1">
                              <MapPinIcon className="size-4 mr-1 text-secondary/70" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="flex flex-wrap gap-2">
                        <div className="badge badge-secondary badge-lg gap-2 px-3 py-2 text-white font-medium">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage)}
                        </div>
                        <div className="badge badge-outline badge-lg gap-2 px-3 py-2 border-2 font-medium hover:bg-secondary/10 transition-colors duration-200">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitialize(user.learningLanguage)}
                        </div>
                      </div>

                      {/* Bio */}
                      {user.bio && (
                        <div className="bg-base-200/50 rounded-2xl p-4 border border-base-300/30">
                          <p className="text-sm text-base-content/80 leading-relaxed">
                            "{user.bio}"
                          </p>
                        </div>
                      )}

                      {/* Action Button */}
                      <button
                        className={`btn w-full h-12 rounded-2xl font-semibold transition-all duration-300 ${
                          hasRequestBeenSent 
                            ? "btn-success text-white cursor-not-allowed" 
                            : "btn-secondary hover:btn-accent hover:scale-[1.02] hover:shadow-lg hover:shadow-secondary/25"
                        }`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <div className="flex items-center gap-2">
                            <CheckCircleIcon className="size-5" />
                            Request Sent ✓
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <UserPlusIcon className="size-5" />
                            Send Friend Request
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
