import { Route, Routes, Navigate } from "react-router-dom"

import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import FriendsPage from "./pages/FriendsPage.jsx";
import PageLoader from "./components/PageLoader.jsx"; //PageLoader: A component that shows a loading spinner while data is being fetched.
import Layout from "./components/Layout.jsx"

import { Toaster } from "react-hot-toast";

//import { useQuery } from "@tanstack/react-query"; //useQuery: A React hook from react-query for fetching and caching data.
///import axiosInstance from "./lib/axios.js"; //axiosInstance: A pre-configured Axios instance to make API calls (probably includes base URL, headers, etc.)
//import { getAuthUser } from "./lib/api.js";
import useAuthUser from "./hooks/useAuthUser.js";
import { Home } from "lucide-react";
import { useThemeStore } from "./store/useThemeStore.js";
import ProfilePage from "./pages/ProfilePage.jsx";


//This fetches the current logged-in user from the backend (/auth/me).
const App = () => {

  const {isLoading,authUser} = useAuthUser();
  const {theme} = useThemeStore();
  //const [data,setData] = useState();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

   //Grabs the actual user object from the data (if it exists).//backent auth route

  if(isLoading) return <PageLoader/>;

  return (
    <div className="h-screen" data-theme={theme}>
    
      <Routes>
        <Route path="/" element={isAuthenticated && isOnboarded ? (
          <Layout showSidebar={true}>
            <HomePage/>
          </Layout>
        ):(
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
        )} />
        <Route path="/signup" element={!isAuthenticated ? <SignUpPage /> : <Navigate to={isOnboarded?"/":"/onboarding"} />} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded?"/":"/onboarding"} />} />
        <Route path="/notifications" 
         element={isAuthenticated && isOnboarded ?(
          <Layout showSidebar={true}>
            <NotificationsPage />
          </Layout>
         ):(
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
         )}
         />
        <Route path="/call/:id" element={
          isAuthenticated && isOnboarded ? (
          
              <CallPage />
    
          ) : (
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )
        }/>
          <Route path="/friends"
           element={isAuthenticated && isOnboarded ? (
             <Layout showSidebar={true}>
               <FriendsPage />
             </Layout>
           ) : (
             <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
           )}
          />
        <Route path="/chat/:id" 
        element={ isAuthenticated && isOnboarded ? (
            <Layout showSidebar={false}>
              <ChatPage/>
              </Layout>
        ):(
         <Navigate to ={!isAuthenticated ? "/login":"/onboarding"}/>
        )}
        />
        <Route path="/onboarding" 
         element={isAuthenticated?(
          !isOnboarded?(
            <OnboardingPage/>
          ):(<Navigate to="/" />)
         ):(
          <Navigate to="/login"/>
         )}
         />

         <Route path="/profile" element={<ProfilePage />} />

          {/* Edit profile uses the same UI as onboarding but is available after onboarding */}
          <Route
            path="/profile/edit"
            element={
              isAuthenticated && isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )
            }
          />


      </Routes>
      <Toaster />
    </div>
  );
}

export default App