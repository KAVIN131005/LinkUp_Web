import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { BellIcon, CheckCircleIcon, ClockIcon, MessageSquareIcon, UserCheckIcon, UserPlusIcon } from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";

const NotificationsPage = () => {
  useDocumentTitle("Notifications");
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-info/5 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-info/10 via-transparent to-primary/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-base-100/80 backdrop-blur-sm p-8 rounded-3xl border border-info/10 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-info to-primary rounded-2xl">
                <BellIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-info via-primary to-secondary bg-clip-text text-transparent">
                  Notifications 🔔
                </h1>
                <p className="text-base-content/70 text-lg">Stay updated with your connections</p>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <span className="loading loading-spinner loading-lg text-info"></span>
              <p className="text-base-content/70">Loading your notifications...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Friend Requests Section */}
            {incomingRequests.length > 0 && (
              <section className="space-y-6">
                <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl border border-primary/10 shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl">
                      <UserCheckIcon className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-base-content">Friend Requests</h2>
                    <div className="badge badge-primary badge-lg px-3 py-2 text-white font-semibold">
                      {incomingRequests.length}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {incomingRequests.map((request, index) => (
                      <div
                        key={request._id}
                        className="group relative bg-base-100/80 backdrop-blur-sm rounded-2xl border border-primary/10 hover:border-primary/30 shadow-md hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* Background gradient on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="relative p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="relative">
                                <div className="avatar w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                                  <img src={request.sender.profilePic} alt={request.sender.fullName} className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full border-2 border-base-100 flex items-center justify-center">
                                  <UserPlusIcon className="w-3 h-3 text-white" />
                                </div>
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-xl text-base-content truncate group-hover:text-primary transition-colors duration-300">
                                  {request.sender.fullName}
                                </h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <span className="badge badge-secondary badge-sm px-2 py-1 text-white font-medium">
                                    Native: {request.sender.nativeLanguage}
                                  </span>
                                  <span className="badge badge-outline badge-sm px-2 py-1 border-2 font-medium">
                                    Learning: {request.sender.learningLanguage}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <button
                              className="btn btn-primary btn-lg rounded-2xl px-6 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                              onClick={() => acceptRequestMutation(request._id)}
                              disabled={isPending}
                            >
                              {isPending ? (
                                <span className="loading loading-spinner loading-sm"></span>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <CheckCircleIcon className="w-5 h-5" />
                                  Accept
                                </div>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Accepted Requests Section */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-6">
                <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl border border-success/10 shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-success to-info rounded-xl">
                      <BellIcon className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-base-content">New Connections 🎉</h2>
                  </div>

                  <div className="space-y-4">
                    {acceptedRequests.map((notification, index) => (
                      <div 
                        key={notification._id} 
                        className="group relative bg-base-100/80 backdrop-blur-sm rounded-2xl border border-success/10 hover:border-success/30 shadow-md hover:shadow-xl hover:shadow-success/10 transition-all duration-300 overflow-hidden"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* Background gradient on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-success/5 via-transparent to-info/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="relative p-6">
                          <div className="flex items-start gap-4">
                            <div className="relative">
                              <div className="avatar mt-1 size-12 rounded-2xl overflow-hidden ring-4 ring-success/20 group-hover:ring-success/40 transition-all duration-300">
                                <img
                                  src={notification.recipient.profilePic}
                                  alt={notification.recipient.fullName}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-base-100 flex items-center justify-center">
                                <CheckCircleIcon className="w-3 h-3 text-white" />
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-base-content group-hover:text-success transition-colors duration-300">
                                {notification.recipient.fullName}
                              </h3>
                              <p className="text-base-content/80 my-2">
                                <span className="font-medium">{notification.recipient.fullName}</span> accepted your friend request! 🎉
                              </p>
                              <div className="flex items-center text-xs text-base-content/60 gap-2">
                                <ClockIcon className="h-3 w-3" />
                                Recently
                              </div>
                            </div>
                            
                            <div className="badge badge-success badge-lg gap-2 px-3 py-2 text-white font-medium">
                              <MessageSquareIcon className="h-4 w-4" />
                              New Friend
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Empty State */}
            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl border border-info/10 shadow-xl">
                <NoNotificationsFound />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default NotificationsPage;
