import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, LinkIcon, UsersIcon } from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-80 bg-base-100/80 backdrop-blur-md border-r border-base-300/50 hidden lg:flex flex-col h-screen sticky top-0 shadow-xl">
      {/* Logo Section */}
      <div className="p-8 border-b border-base-300/30">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl group-hover:scale-110 transition-transform duration-300">
            <LinkIcon className="size-8 text-white" />
          </div>
          <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent tracking-wide">
            Link Up
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        <Link
          to="/"
          className={`group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
            currentPath === "/" 
              ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25" 
              : "hover:bg-base-200/70 hover:scale-[1.02]"
          }`}
        >
          <HomeIcon className={`size-6 transition-transform duration-300 group-hover:scale-110 ${
            currentPath === "/" ? "text-white" : "text-base-content/70"
          }`} />
          <span className={`font-semibold text-lg ${
            currentPath === "/" ? "text-white" : "text-base-content"
          }`}>Home</span>
        </Link>

        <Link
          to="/friends"
          className={`group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
            currentPath === "/friends" 
              ? "bg-gradient-to-r from-secondary to-accent text-white shadow-lg shadow-secondary/25" 
              : "hover:bg-base-200/70 hover:scale-[1.02]"
          }`}
        >
          <UsersIcon className={`size-6 transition-transform duration-300 group-hover:scale-110 ${
            currentPath === "/friends" ? "text-white" : "text-base-content/70"
          }`} />
          <span className={`font-semibold text-lg ${
            currentPath === "/friends" ? "text-white" : "text-base-content"
          }`}>Friends</span>
        </Link>

        <Link
          to="/notifications"
          className={`group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 relative ${
            currentPath === "/notifications" 
              ? "bg-gradient-to-r from-info to-primary text-white shadow-lg shadow-info/25" 
              : "hover:bg-base-200/70 hover:scale-[1.02]"
          }`}
        >
          <BellIcon className={`size-6 transition-transform duration-300 group-hover:scale-110 ${
            currentPath === "/notifications" ? "text-white" : "text-base-content/70"
          }`} />
          <span className={`font-semibold text-lg ${
            currentPath === "/notifications" ? "text-white" : "text-base-content"
          }`}>Notifications</span>
          {/* Notification badge */}
          <div className="absolute top-2 right-2 w-3 h-3 bg-error rounded-full animate-pulse"></div>
        </Link>
      </nav>

      {/* USER PROFILE SECTION */}
      <div className="p-6 border-t border-base-300/30">
        <div className="bg-base-200/50 backdrop-blur-sm rounded-3xl p-6 border border-base-300/30">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="avatar size-16 rounded-2xl overflow-hidden ring-4 ring-primary/20">
                <img src={authUser?.profilePic} alt={authUser?.fullName} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-base-100 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-base-content truncate">{authUser?.fullName}</h3>
              <p className="text-sm text-base-content/60">Language Learner</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="badge badge-primary badge-sm text-white">
                Native: {authUser?.nativeLanguage}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="badge badge-outline badge-sm border-2">
                Learning: {authUser?.learningLanguage}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
