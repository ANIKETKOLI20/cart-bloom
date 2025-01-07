import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/Homepage.js";
import SignUpPage from "./pages/SignUpPage.js";
import LoginPage from "./pages/LoginPage.js";
import LoadingSpinner from './components/LoadingSpinner.js';
import NotFoundPage from './pages/NotFoundPage.js';

import CustomCursor from "./components/CustomCursor";
import { useQuery } from "@tanstack/react-query";

import { Toaster } from "react-hot-toast";
import axios from "axios";
import Navbar from "./components/Navbar.js";

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/auth/me"); 
        if (res.status !== 200) {
          throw new Error(res.data.error || "Something went wrong");
        }
        const data = res.data;
        console.log(data); 
        return data;
      } catch (error) {
        if (error.response?.status === 401) return null;
        const errorMessage = error.response?.data?.error || error.message || "An unknown error occurred";
        throw new Error(errorMessage);
      }
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>

      {/* Custom Cursor */}
      <CustomCursor />

      <div className="relative z-50 pt-20">
        {authUser && <Navbar />}
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;