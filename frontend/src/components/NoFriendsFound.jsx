const NoFriendsFound = () => {
  return (
    <div className="relative bg-base-100/80 backdrop-blur-sm rounded-3xl border border-primary/10 shadow-xl p-12 text-center overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
      
      <div className="relative space-y-6">
        {/* Emoji Icon */}
        <div className="text-8xl animate-bounce">👥</div>
        
        <div className="space-y-3">
          <h3 className="font-bold text-3xl text-base-content">No friends yet! 🌟</h3>
          <p className="text-lg text-base-content/70 max-w-md mx-auto leading-relaxed">
            Start your language learning journey by connecting with amazing language partners from around the world
          </p>
        </div>

        {/* Fun decorative elements */}
        <div className="flex justify-center items-center gap-4 pt-4">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-secondary rounded-full animate-pulse animation-delay-200"></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse animation-delay-400"></div>
        </div>
      </div>
    </div>
  );
};

export default NoFriendsFound;
