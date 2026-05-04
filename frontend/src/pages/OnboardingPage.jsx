import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { LoaderIcon, LinkIcon, MapPinIcon, ShuffleIcon } from "lucide-react";
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
  useDocumentTitle("Setup Profile");
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

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

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-accent/5 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl">
        {/* Background Decorations */}
        <div className="absolute -top-8 -left-8 w-72 h-72 bg-accent/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        
        <div className="relative bg-base-100/90 backdrop-blur-sm border border-accent/20 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 sm:p-12">
            {/* Header */}
            <div className="text-center mb-10 space-y-4">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-accent to-primary rounded-2xl">
                  <LinkIcon className="size-10 text-white" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
                  Complete Your Profile ✨
                </h1>
              </div>
              <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                Let's set up your amazing profile to connect with the perfect language partners
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Profile Picture Section */}
              <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl border border-accent/10 p-8">
                <div className="flex flex-col items-center justify-center space-y-6">
                  <h3 className="text-2xl font-bold text-base-content">Profile Picture</h3>
                  
                  {/* Image Preview */}
                  <div className="relative group">
                    <div className="size-32 rounded-3xl bg-gradient-to-br from-accent/20 to-primary/20 overflow-hidden ring-4 ring-accent/20 group-hover:ring-accent/40 transition-all duration-300">
                      {formState.profilePic ? (
                        <img
                          src={formState.profilePic}
                          alt="Profile Preview"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-6xl">📷</div>
                        </div>
                      )}
                    </div>
                    {formState.profilePic && (
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-success rounded-full border-4 border-base-100 flex items-center justify-center">
                        <div className="text-lg">✓</div>
                      </div>
                    )}
                  </div>

                  {/* Generate Random Avatar Button */}
                  <button 
                    type="button" 
                    onClick={handleRandomAvatar} 
                    className="btn btn-accent btn-lg rounded-2xl px-8 hover:scale-105 hover:shadow-lg hover:shadow-accent/25 transition-all duration-300"
                  >
                    <ShuffleIcon className="size-5 mr-2" />
                    Generate Random Avatar
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="bg-base-100/80 backdrop-blur-sm rounded-3xl border border-primary/10 p-8 space-y-6">
                {/* Full Name */}
                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text font-semibold text-lg">Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formState.fullName}
                    onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                    className="input input-bordered w-full h-14 text-lg rounded-2xl border-2 focus:border-primary focus:scale-[1.02] transition-all duration-300"
                    placeholder="Your full name"
                  />
                </div>

                {/* Bio */}
                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text font-semibold text-lg">Bio</span>
                  </label>
                  <textarea
                    name="bio"
                    value={formState.bio}
                    onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                    className="textarea textarea-bordered h-32 text-lg rounded-2xl border-2 focus:border-primary focus:scale-[1.02] transition-all duration-300 resize-none"
                    placeholder="Tell others about yourself and your language learning goals..."
                  />
                </div>

                {/* Languages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Native Language */}
                  <div className="form-control">
                    <label className="label pb-2">
                      <span className="label-text font-semibold text-lg">Native Language 🏠</span>
                    </label>
                    <select
                      name="nativeLanguage"
                      value={formState.nativeLanguage}
                      onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                      className="select select-bordered w-full h-14 text-lg rounded-2xl border-2 focus:border-secondary focus:scale-[1.02] transition-all duration-300"
                    >
                      <option value="">Select your native language</option>
                      {LANGUAGES.map((lang) => (
                        <option key={`native-${lang}`} value={lang.toLowerCase()}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Learning Language */}
                  <div className="form-control">
                    <label className="label pb-2">
                      <span className="label-text font-semibold text-lg">Learning Language 📚</span>
                    </label>
                    <select
                      name="learningLanguage"
                      value={formState.learningLanguage}
                      onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                      className="select select-bordered w-full h-14 text-lg rounded-2xl border-2 focus:border-accent focus:scale-[1.02] transition-all duration-300"
                    >
                      <option value="">Select language you're learning</option>
                      {LANGUAGES.map((lang) => (
                        <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text font-semibold text-lg">Location 📍</span>
                  </label>
                  <div className="relative">
                    <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-4 size-6 text-primary/70" />
                    <input
                      type="text"
                      name="location"
                      value={formState.location}
                      onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                      className="input input-bordered w-full h-14 text-lg rounded-2xl border-2 focus:border-primary focus:scale-[1.02] transition-all duration-300 pl-14"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button 
                  className="btn btn-primary btn-lg w-full sm:w-auto sm:px-16 h-16 text-xl font-bold rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 border-0 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/25 transition-all duration-500" 
                  disabled={isPending} 
                  type="submit"
                >
                  {!isPending ? (
                    <div className="flex items-center gap-3">
                      <LinkIcon className="size-6" />
                      Complete Onboarding 🚀
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <LoaderIcon className="animate-spin size-6" />
                      Creating your amazing profile...
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
