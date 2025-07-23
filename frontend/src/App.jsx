import { Route, Routes, Navigate } from "react-router-dom"

import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import PageLoader from "./components/PageLoader.jsx"; //PageLoader: A component that shows a loading spinner while data is being fetched.


import { Toaster } from "react-hot-toast";

//import { useQuery } from "@tanstack/react-query"; //useQuery: A React hook from react-query for fetching and caching data.
///import axiosInstance from "./lib/axios.js"; //axiosInstance: A pre-configured Axios instance to make API calls (probably includes base URL, headers, etc.)
//import { getAuthUser } from "./lib/api.js";
import useAuthUser from "./hooks/useAuthUser.js";
import { Home } from "lucide-react";


//This fetches the current logged-in user from the backend (/auth/me).
const App = () => {

  const {isLoading,authUser} = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

   //Grabs the actual user object from the data (if it exists).//backent auth route

  if(isLoading) return <PageLoader/>;

  return (
    <div className="h-screen">
      <Routes>
        <Route path="/" element={isAuthenticated && isOnboarded ? (
          <HomePage/>
        ):(
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
        )} />
        <Route path="/signup" element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/notification" element={isAuthenticated ? <NotificationsPage /> : <Navigate to="/login" />} />
        <Route path="/call" element={isAuthenticated ? <CallPage /> : <Navigate to="/login" />} />
        <Route path="/chat" element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/onboarding" element={isAuthenticated ? <OnboardingPage /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App