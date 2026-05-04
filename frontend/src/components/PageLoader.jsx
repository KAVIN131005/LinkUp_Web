import { LoaderIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const PageLoader = () => {
  const { theme } = useThemeStore();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200/50 to-primary/5" data-theme={theme}>
      <div className="text-center space-y-8">
        {/* Main Loader */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="relative bg-base-100/80 backdrop-blur-sm rounded-3xl p-8 border border-primary/10 shadow-xl">
            <LoaderIcon className="animate-spin size-16 text-primary mx-auto" />
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Loading your experience...
          </h2>
          <p className="text-base-content/70">Please wait while we prepare everything for you</p>
        </div>
        
        {/* Animated Dots */}
        <div className="flex justify-center items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-secondary rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-3 h-3 bg-accent rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </div>
    </div>
  );
};
export default PageLoader;
