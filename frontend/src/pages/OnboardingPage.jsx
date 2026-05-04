import { useState, useRef } from "react";
import useAuthUser from "../hooks/useAuthUser";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { LoaderIcon, LinkIcon, MapPinIcon, ShuffleIcon, Upload } from "lucide-react";
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
  useDocumentTitle("Setup Profile");
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  // Emoji list for random avatar
  const EMOJI_AVATARS = [
    "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂",
    "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰",
    "😘", "😗", "😚", "😙", "🥲", "😋", "😛", "😜",
    "🤪", "😝", "😑", "😐", "😏", "😒", "🙁", "😔",
    "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢",
    "🤮", "🤧", "🤬", "🤡", "😈", "👿", "💀", "☠️",
    "💩", "🤓", "😎", "🤩", "🥳", "😕", "😟", "🙐",
    "😬", "🤐", "😌", "😔", "😪", "🤤", "😴", "😷",
    "🎉", "🎊", "🎈", "🎁", "🎀", "🎂", "🍰", "🧁",
    "🍪", "🍩", "🍫", "🍬", "🍭", "🍮", "🍯", "🍼",
    "☕", "🍵", "🍶", "🍾", "🍷", "🍸", "🍹", "🍺",
    "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼",
    "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🙈"
  ];

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },

    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormState({ ...formState, profilePic: event.target.result });
        toast.success("Profile picture uploaded!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRandomAvatar = () => {
    const randomEmoji = EMOJI_AVATARS[Math.floor(Math.random() * EMOJI_AVATARS.length)];
    
    // Create a canvas to render emoji as image
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");
    
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 200, 200);
    gradient.addColorStop(0, ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA502", "#FF6348"][Math.floor(Math.random() * 5)]);
    gradient.addColorStop(1, ["#FF8E72", "#A8E6CF", "#96CEB4", "#FFD700", "#FF7F50"][Math.floor(Math.random() * 5)]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 200, 200);
    
    // Draw emoji
    ctx.font = "100px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(randomEmoji, 100, 100);
    
    // Convert to data URL
    const emojiAvatar = canvas.toDataURL();
    setFormState({ ...formState, profilePic: emojiAvatar });
    toast.success(`Random emoji avatar created! ${randomEmoji}`);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-2 sm:p-4 py-6 sm:py-8 relative overflow-hidden"
      data-theme="forest"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: "1s"}}></div>
        <div className="absolute top-3/4 left-3/4 w-48 h-48 bg-pink-500/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: "2s"}}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-4xl mx-auto">
        {/* Main Card */}
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/50 via-blue-500/50 to-pink-500/50 rounded-2xl sm:rounded-3xl blur opacity-75"></div>
          <div className="relative bg-black/20 backdrop-blur-xl m-1 rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-12">
            
            {/* Header */}
            <div className="text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
              <div className="inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg shadow-purple-500/25">
                <LinkIcon className="size-8 sm:size-10 text-white" />
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white">
                Complete Your Profile ✨
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-2xl mx-auto px-2">
                Set up your profile to connect with amazing language partners worldwide
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Profile Picture Section */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-8">
                <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Profile Picture</h3>
                  
                  {/* Image Preview */}
                  <div className="relative group">
                    <div className="size-28 sm:size-40 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 overflow-hidden ring-4 sm:ring-4 ring-purple-500/30 group-hover:ring-purple-400 transition-all duration-300 shadow-lg">
                      {formState.profilePic ? (
                        <img
                          src={formState.profilePic}
                          alt="Profile Preview"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-600/20 to-gray-700/20">
                          <div className="text-5xl sm:text-8xl">📷</div>
                        </div>
                      )}
                    </div>
                    {formState.profilePic && (
                      <div className="absolute -bottom-3 -right-3 w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full border-3 sm:border-4 border-gray-900 flex items-center justify-center shadow-lg">
                        <span className="text-sm sm:text-lg">✓</span>
                      </div>
                    )}
                  </div>

                  {/* Buttons Section */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                    {/* Upload from Gallery Button */}
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()} 
                      className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 text-sm sm:text-base border border-blue-400/20"
                    >
                      <Upload className="size-4 sm:size-5" />
                      Gallery
                    </button>

                    {/* Generate Random Emoji Avatar Button */}
                    <button 
                      type="button" 
                      onClick={handleRandomAvatar} 
                      className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2 text-sm sm:text-base border border-purple-400/20"
                    >
                      <ShuffleIcon className="size-4 sm:size-5" />
                      Random Emoji
                    </button>
                  </div>

                  {/* Hidden File Input */}
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Form Fields */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-8 space-y-4 sm:space-y-6">
                {/* Full Name */}
                <div className="form-control">
                  <label className="label pb-1 sm:pb-2">
                    <span className="label-text font-bold text-sm sm:text-base text-white">Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formState.fullName}
                    onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                    className="input input-sm sm:input-md w-full text-sm sm:text-base rounded-lg sm:rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-300"
                    placeholder="Your full name"
                  />
                </div>

                {/* Bio */}
                <div className="form-control">
                  <label className="label pb-1 sm:pb-2">
                    <span className="label-text font-bold text-sm sm:text-base text-white">Bio</span>
                  </label>
                  <textarea
                    name="bio"
                    value={formState.bio}
                    onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                    className="textarea w-full h-24 sm:h-32 text-sm sm:text-base rounded-lg sm:rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-300 resize-none"
                    placeholder="Tell others about yourself and your language learning goals..."
                  />
                </div>

                {/* Languages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Native Language */}
                  <div className="form-control">
                    <label className="label pb-1 sm:pb-2">
                      <span className="label-text font-bold text-sm sm:text-base text-white">Native Language 🏠</span>
                    </label>
                    <select
                      name="nativeLanguage"
                      value={formState.nativeLanguage}
                      onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                      className="select select-sm sm:select-md w-full text-sm sm:text-base rounded-lg sm:rounded-xl bg-white/10 border-2 border-white/20 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-300"
                    >
                      <option value="" className="bg-gray-800">Select your native language</option>
                      {LANGUAGES.map((lang) => (
                        <option key={`native-${lang}`} value={lang.toLowerCase()} className="bg-gray-800">
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Learning Language */}
                  <div className="form-control">
                    <label className="label pb-1 sm:pb-2">
                      <span className="label-text font-bold text-sm sm:text-base text-white">Learning Language 📚</span>
                    </label>
                    <select
                      name="learningLanguage"
                      value={formState.learningLanguage}
                      onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                      className="select select-sm sm:select-md w-full text-sm sm:text-base rounded-lg sm:rounded-xl bg-white/10 border-2 border-white/20 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-300"
                    >
                      <option value="" className="bg-gray-800">Select language you're learning</option>
                      {LANGUAGES.map((lang) => (
                        <option key={`learning-${lang}`} value={lang.toLowerCase()} className="bg-gray-800">
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div className="form-control">
                  <label className="label pb-1 sm:pb-2">
                    <span className="label-text font-bold text-sm sm:text-base text-white">Location 📍</span>
                  </label>
                  <div className="relative">
                    <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 sm:left-4 size-4 sm:size-5 text-blue-400/70" />
                    <input
                      type="text"
                      name="location"
                      value={formState.location}
                      onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                      className="input input-sm sm:input-md w-full text-sm sm:text-base rounded-lg sm:rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-300 pl-10 sm:pl-12"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button 
                  className="w-full sm:w-auto px-6 sm:px-16 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 hover:from-purple-700 hover:via-blue-700 hover:to-pink-700 text-white border border-purple-400/20 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
                  disabled={isPending} 
                  type="submit"
                >
                  {!isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <LinkIcon className="size-5 sm:size-6" />
                      <span>Complete Onboarding 🚀</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <LoaderIcon className="animate-spin size-5 sm:size-6" />
                      <span>Creating profile...</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OnboardingPage;
