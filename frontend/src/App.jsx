import { Route, Routes, Navigate } from "react-router-dom"

import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";

import { Toaster } from "react-hot-toast";

import { useQuery } from "@tanstack/react-query"; //useQuery: A React hook from react-query for fetching and caching data.
import axiosInstance from "./lib/axios.js"; //axiosInstance: A pre-configured Axios instance to make API calls (probably includes base URL, headers, etc.)


//This fetches the current logged-in user from the backend (/auth/me).
const App = () => {
  const { data: authData, isLoading, error } = useQuery({
    queryKey: ["authUser"],  // uniquely identifies this request in the cache.
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
    retry: false,
  });

  const authUser = authData?.user; //Grabs the actual user object from the data (if it exists).//backent auth route

  return (
    <div className="h-screen">
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/notification" element={authUser ? <NotificationsPage /> : <Navigate to="/login" />} />
        <Route path="/call" element={authUser ? <CallPage /> : <Navigate to="/login" />} />
        <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/onboarding" element={authUser ? <OnboardingPage /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App