import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full gap-4">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className="pl-5 mr-auto">
              <Link to="/" className="flex items-center gap-2.5">
                <ShipWheelIcon className="w-8 h-8 text-primary transition-transform duration-300 hover:rotate-12" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  LinkUp
                </span>
              </Link>
            </div>
          )}

          {/* Notifications */}
          <Link to="/notifications">
            <button className="btn btn-ghost btn-circle hover:bg-base-300 transition">
              <BellIcon className="w-6 h-6 text-base-content hover:text-primary transition duration-200" />
            </button>
          </Link>

          {/* Theme Switcher */}
          <ThemeSelector />

          {/* User Avatar */}
          <div className="avatar">
            <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>

          {/* Logout */}
          <button
            className="btn btn-ghost btn-circle hover:bg-base-300 transition"
            onClick={logoutMutation}
          >
            <LogOutIcon className="w-6 h-6 text-base-content hover:text-error transition duration-200" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
