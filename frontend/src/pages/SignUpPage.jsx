import { useState } from "react";
import { LinkIcon } from "lucide-react";
import { Link } from "react-router";
import useDocumentTitle from "../hooks/useDocumentTitle";

import useSignUp from "../hooks/useSignUp";

const SignUpPage = () => {
  useDocumentTitle("Sign Up");
  
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // This is how we did it at first, without using our custom hook
  // const queryClient = useQueryClient();
  // const {
  //   mutate: signupMutation,
  //   isPending,
  //   error,
  // } = useMutation({
  //   mutationFn: signup,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  // This is how we did it using our custom hook - optimized version
  const { isPending, error, signupMutation } = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-tr from-emerald-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden"
      data-theme="forest"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative w-full max-w-lg mx-auto">
        {/* Main Signup Card */}
        <div className="relative">
          {/* Glowing Border Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-3xl blur opacity-75 animate-pulse"></div>
          
          <div className="relative bg-black/30 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8">
              
              {/* Header Section */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-3xl mb-6 shadow-lg shadow-emerald-500/25 animate-pulse">
                  <LinkIcon className="size-12 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
                  Join Link Up
                </h1>
                <p className="text-gray-300 text-lg">Create your account and start connecting</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 mb-6 backdrop-blur-sm">
                  <p className="text-red-300 text-center font-medium">{error.response.data.message}</p>
                </div>
              )}

              {/* Signup Form */}
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-4">
                  {/* Full Name Field */}
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full h-14 bg-white/5 border border-white/20 rounded-2xl px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/10"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                      required
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>

                  {/* Email Field */}
                  <div className="relative group">
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full h-14 bg-white/5 border border-white/20 rounded-2xl px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/10"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>

                  {/* Password Field */}
                  <div className="relative group">
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full h-14 bg-white/5 border border-white/20 rounded-2xl px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/10"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    <p className="text-gray-400 text-xs mt-2 ml-1">
                      Password must be at least 6 characters
                    </p>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors duration-300">
                    <input 
                      type="checkbox" 
                      className="mt-1 w-5 h-5 rounded border-2 border-white/30 bg-transparent checked:bg-gradient-to-r checked:from-emerald-500 checked:to-blue-500 focus:ring-2 focus:ring-emerald-500/50" 
                      required 
                    />
                    <label className="text-sm text-gray-300 leading-relaxed cursor-pointer">
                      I agree to the{" "}
                      <span className="text-emerald-400 hover:text-blue-400 transition-colors duration-200 cursor-pointer underline">
                        Terms of Service
                      </span>{" "}
                      and{" "}
                      <span className="text-blue-400 hover:text-purple-400 transition-colors duration-200 cursor-pointer underline">
                        Privacy Policy
                      </span>
                    </label>
                  </div>
                </div>

                {/* Create Account Button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-16 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-600 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <span className="relative">
                    {isPending ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating Account...
                      </div>
                    ) : (
                      "Create Your Account"
                    )}
                  </span>
                </button>

                {/* Login Link */}
                <div className="text-center pt-4">
                  <p className="text-gray-300">
                    Already have an account?{" "}
                    <Link 
                      to="/login" 
                      className="text-emerald-400 hover:text-blue-400 font-semibold transition-colors duration-200"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          {[
            { emoji: "🔒", text: "Secure" },
            { emoji: "⚡", text: "Fast" },
            { emoji: "🌍", text: "Global" }
          ].map((feature, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className="text-2xl mb-1">{feature.emoji}</div>
              <div className="text-white/80 text-sm font-medium">{feature.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
