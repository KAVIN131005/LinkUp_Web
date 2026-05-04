import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      // Show success message
      toast.success("Logged out successfully");
      // Redirect to login page
      navigate("/login");
    },
    onError: (error) => {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    },
  });

  return { logoutMutation, isPending, error };
};
export default useLogout;
