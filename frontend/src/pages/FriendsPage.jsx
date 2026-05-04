import { useQuery } from "@tanstack/react-query";
import FriendCard from "../components/FriendCard.jsx";
import NoFriendsFound from "../components/NoFriendsFound.jsx";
import useAuthUser from "../hooks/useAuthUser.js";
import { getUserFriends } from "../lib/api.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";

const FriendsPage = () => {
  useDocumentTitle("Friends");
  
  const { authUser } = useAuthUser();

  const { data: friends, isLoading, error } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    enabled: !!authUser,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-primary/5 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary" />
          <p className="text-lg text-base-content/70">Loading your amazing friends...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-error/5 flex items-center justify-center p-4">
        <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl border border-error/20 shadow-xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-error mb-2">Oops! Something went wrong</h3>
          <p className="text-base-content/70">Error loading friends. Please try again later.</p>
        </div>
      </div>
    );
  }
  
  if (friends.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-primary/5 flex items-center justify-center p-4">
        <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl border border-primary/10 shadow-xl">
          <NoFriendsFound />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-primary/5 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-base-100/80 backdrop-blur-sm p-8 rounded-3xl border border-primary/10 shadow-xl">
            <div className="text-center space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Your Language Partners 🌟
              </h1>
              <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                Connect and practice with {friends.length} amazing language {friends.length === 1 ? 'partner' : 'partners'}
              </p>
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-primary">{friends.length} Active Friends</span>
              </div>
            </div>
          </div>
        </div>

        {/* Friends Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {friends.map((friend, index) => (
            <div 
              key={friend._id} 
              className="transform hover:scale-105 transition-all duration-300 animate-fade-in"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both'
              }}
            >
              <FriendCard friend={friend} />
            </div>
          ))}
        </div>

        {/* Fun Stats Section */}
        <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl border border-secondary/10 shadow-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">{friends.length}</div>
              <div className="text-sm text-base-content/70">Total Friends</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-secondary">
                {new Set(friends.map(f => f.nativeLanguage)).size}
              </div>
              <div className="text-sm text-base-content/70">Languages Represented</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-accent">∞</div>
              <div className="text-sm text-base-content/70">Learning Opportunities</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
