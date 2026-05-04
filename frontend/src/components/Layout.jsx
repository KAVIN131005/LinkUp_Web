import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Menu, X } from "lucide-react";

const Layout = ({ children, showSidebar = false }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar when navigating
  const handleNavigation = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen">
      <div className="flex h-screen">
        {/* Mobile Sidebar - Overlay */}
        {showSidebar && (
          <>
            {/* Backdrop */}
            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            {/* Mobile Sidebar */}
            <div
              className={`
                fixed lg:relative
                w-80 h-screen
                bg-base-100/80 backdrop-blur-md border-r border-base-300/50
                z-50 lg:z-0
                transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                lg:flex flex-col
                overflow-y-auto
              `}
            >
              <Sidebar onNavigate={handleNavigation} />
            </div>
          </>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col w-full lg:w-auto">
          {/* Navbar with Menu Toggle */}
          <nav className="bg-base-100/80 backdrop-blur-md border-b border-base-300/50 sticky top-0 z-30 h-16 lg:h-20 flex items-center shadow-lg">
            <div className="container mx-auto px-2 sm:px-4 lg:px-8 w-full">
              <div className="flex items-center justify-between lg:justify-end w-full gap-2 lg:gap-6">
                {/* Mobile Menu Toggle */}
                {showSidebar && (
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden btn btn-ghost btn-circle btn-sm lg:btn-lg hover:bg-primary/10 transition-all duration-300"
                    title="Toggle menu"
                  >
                    {isSidebarOpen ? (
                      <X className="w-5 h-5 lg:w-6 lg:h-6" />
                    ) : (
                      <Menu className="w-5 h-5 lg:w-6 lg:h-6" />
                    )}
                  </button>
                )}

                {/* Navbar Content */}
                <Navbar />
              </div>
            </div>
          </nav>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
