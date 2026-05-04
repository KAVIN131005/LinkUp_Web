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
    <nav className="bg-base-100/80 backdrop-blur-md border-b border-base-300/50 sticky top-0 z-30 h-20 flex items-center shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full gap-6">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className="pl-5 mr-auto">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <LinkIcon className="size-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent tracking-wide">
                  Link Up
                </span>
              </Link>
            </div>
          )}

          {/* USER PROFILE INFO */}
          {authUser && !isChatPage && (
            <div className="flex items-center gap-3 bg-base-200/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-base-300/30">
              <div className="avatar size-10 rounded-xl overflow-hidden ring-2 ring-primary/20">
                <img src={authUser.profilePic} alt={authUser.fullName} className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block">
                <div className="font-semibold text-base-content">{authUser.fullName}</div>
                <div className="text-xs text-base-content/60">
                  {authUser.nativeLanguage} → {authUser.learningLanguage}
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          <Link to="/notifications">
            <button className="btn btn-ghost btn-circle btn-lg hover:bg-primary/10 hover:scale-110 transition-all duration-300 relative group">
              <BellIcon className="w-6 h-6 text-base-content group-hover:text-primary transition-colors duration-200" />
              {/* Notification badge */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full animate-pulse"></div>
            </button>
          </Link>

          {/* Theme Switcher */}
          <div className="dropdown dropdown-end">
            <ThemeSelector />
          </div>

          {/* User Avatar */}
          {isChatPage && (
            <div className="avatar group">
              <div className="w-12 rounded-2xl ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300 overflow-hidden">
                <img src={authUser?.profilePic} alt="User Avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          )}

          {/* Logout */}
          <button
            className="btn btn-ghost btn-circle btn-lg hover:bg-error/10 hover:scale-110 transition-all duration-300 group"
            onClick={logoutMutation}
            disabled={isPending}
            title="Logout"
          >
            {isPending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <LogOutIcon className="w-6 h-6 text-base-content group-hover:text-error transition-colors duration-200" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
