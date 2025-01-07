import { UserPlus, LogIn, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const queryClient = useQueryClient();

  const { mutate: logout , isLoading } = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/auth/logout");
      if (response.status !== 200) {
        throw new Error("Failed to log out");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("authUser");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Logout failed");
    },
  });

  // Mock user authentication state (replace with actual user state)
  const user = true; // Replace with your actual user state

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-emerald-400 items-center space-x-2 flex"
          >
            E-Commerce
          </Link>

          <nav className="flex flex-wrap items-center gap-4">
            {user ? (
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                onClick={() => logout()}
                disabled={isLoading}
              >
                <LogOut className="mr-2" size={18} />
                {isLoading ? "Logging out..." : "Log Out"}
              </button>
            ) : (
              <>
                <Link
                  to={"/signup"}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <UserPlus className="mr-2" size={18} />
                  Sign Up
                </Link>
                <Link
                  to={"/login"}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
