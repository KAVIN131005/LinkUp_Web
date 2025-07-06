import { useQuery } from "@tanstack/react-query";
import FriendCard from "../components/FriendCard.jsx";
import NoFriendsFound from "../components/NoFriendsFound.jsx";
import useAuthUser from "../hooks/useAuthUser.js";

const fetchFriends = async () => {
  const res = await fetch("/api/users/friends", {
    credentials: "include", // or send token if needed
  });

  if (!res.ok) throw new Error("Failed to fetch friends");
  return res.json();
};

const FriendsPage = () => {
  const { authUser } = useAuthUser();

  const { data: friends, isLoading, error } = useQuery({
    queryKey: ["friends"],
    queryFn: fetchFriends,
    enabled: !!authUser,
  });

  if (isLoading) return <p className="text-center p-4">Loading friends...</p>;
  if (error) return <p className="text-center text-red-500 p-4">Error loading friends.</p>;
  if (friends.length === 0) return <NoFriendsFound />;

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {friends.map((friend) => (
        <FriendCard key={friend._id} friend={friend} />
      ))}
    </div>
  );
};

export default FriendsPage;
