import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";

const FriendCard = ({ friend }) => {
  return (
    <div className="group relative bg-base-100/80 backdrop-blur-sm rounded-3xl border border-primary/10 hover:border-primary/30 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative p-6 space-y-4">
        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="avatar size-16 rounded-2xl overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
              <img src={friend.profilePic} alt={friend.fullName} className="w-full h-full object-cover" />
            </div>
            {/* Online status indicator */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-base-100 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-xl text-base-content truncate group-hover:text-primary transition-colors duration-300">
              {friend.fullName}
            </h3>
            <p className="text-sm text-base-content/60">Language Partner</p>
          </div>
        </div>

        {/* Languages */}
        <div className="flex flex-wrap gap-2">
          <div className="badge badge-primary badge-lg gap-2 px-3 py-2 text-white font-medium">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </div>
          <div className="badge badge-outline badge-lg gap-2 px-3 py-2 border-2 font-medium hover:bg-primary/10 transition-colors duration-200">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </div>
        </div>

        {/* Message Button */}
        <Link 
          to={`/chat/${friend._id}`} 
          className="btn btn-outline btn-lg w-full rounded-2xl border-2 hover:btn-primary hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 group/btn"
        >
          <div className="flex items-center gap-2">
            💬
            <span className="group-hover/btn:translate-x-1 transition-transform duration-200">Message</span>
          </div>
        </Link>
      </div>
    </div>
  );
};
export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
