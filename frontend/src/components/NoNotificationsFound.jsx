import { BellIcon } from "lucide-react";

function NoNotificationsFound() {
  return (
    <div className="relative bg-base-100/80 backdrop-blur-sm rounded-3xl border border-info/10 shadow-xl p-16 text-center overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-info/5 via-transparent to-primary/5"></div>
      
      <div className="relative space-y-6">
        {/* Icon Container */}
        <div className="relative mx-auto w-24 h-24 bg-gradient-to-br from-info/20 to-primary/20 rounded-3xl flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-info/30 to-primary/30 rounded-3xl blur-xl"></div>
          <BellIcon className="relative size-12 text-info animate-pulse" />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-3xl font-bold text-base-content">All caught up! 🎉</h3>
          <p className="text-lg text-base-content/70 max-w-lg mx-auto leading-relaxed">
            No new notifications right now. When you receive friend requests or messages, they'll magically appear here
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center items-center gap-3 pt-6">
          <div className="w-2 h-2 bg-info rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </div>
    </div>
  );
}

export default NoNotificationsFound;
