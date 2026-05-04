import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LinkIcon, LogOutIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation, isPending } = useLogout();

  return (
    <div className="flex items-center justify-end w-full gap-2 sm:gap-3 lg:gap-6">
      {/* LOGO - ONLY IN THE CHAT PAGE (mobile + desktop) */}
      {isChatPage && (
        <div className="mr-auto">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1.5 lg:p-2 bg-gradient-to-br from-primary to-secondary rounded-lg lg:rounded-xl group-hover:scale-110 transition-transform duration-300">
              <LinkIcon className="size-4 lg:size-6 text-white" />
            </div>
            <span className="hidden sm:inline text-lg lg:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent tracking-wide">
              Link Up
            </span>
          </Link>
        </div>
      )}

      {/* USER PROFILE INFO - Hidden on mobile, shown on larger screens */}
      {authUser && !isChatPage && (
        <div className="hidden md:flex items-center gap-2 lg:gap-3 bg-base-200/50 backdrop-blur-sm rounded-2xl px-2 lg:px-4 py-1 lg:py-2 border border-base-300/30">
          <div className="avatar size-8 lg:size-10 rounded-xl overflow-hidden ring-2 ring-primary/20">
            <img src={authUser.profilePic} alt={authUser.fullName} className="w-full h-full object-cover" />
          </div>
          <div className="hidden lg:block">
            <div className="font-semibold text-sm lg:text-base text-base-content">{authUser.fullName}</div>
            <div className="text-xs text-base-content/60">
              {authUser.nativeLanguage} → {authUser.learningLanguage}
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      <Link to="/notifications">
        <button className="btn btn-ghost btn-circle btn-sm lg:btn-lg hover:bg-primary/10 hover:scale-110 transition-all duration-300 relative group">
          <BellIcon className="w-4 lg:w-6 h-4 lg:h-6 text-base-content group-hover:text-primary transition-colors duration-200" />
          {/* Notification badge */}
          <div className="absolute -top-1 -right-1 w-2 lg:w-3 h-2 lg:h-3 bg-error rounded-full animate-pulse"></div>
        </button>
      </Link>

      {/* Theme Switcher - Compact on mobile */}
      <div className="dropdown dropdown-end">
        <ThemeSelector />
      </div>

      {/* User Avatar - Only on chat page */}
      {isChatPage && (
        <div className="avatar group hidden sm:block">
          <div className="w-10 lg:w-12 rounded-2xl ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300 overflow-hidden">
            <img src={authUser?.profilePic} alt="User Avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      )}

      {/* Logout */}
      <button
        className="btn btn-ghost btn-circle btn-sm lg:btn-lg hover:bg-error/10 hover:scale-110 transition-all duration-300 group"
        onClick={logoutMutation}
        disabled={isPending}
        title="Logout"
      >
        {isPending ? (
          <span className="loading loading-spinner loading-xs lg:loading-sm"></span>
        ) : (
          <LogOutIcon className="w-4 lg:w-6 h-4 lg:h-6 text-base-content group-hover:text-error transition-colors duration-200" />
        )}
      </button>
    </div>
  );
};

export default Navbar;
