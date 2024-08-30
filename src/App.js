import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import ProfilePage from "./Pages/ProfilePage";
import StoryComponent from "./components/StoryComponent";
import useAuth from './components/Auth';
import ExplorePost from './Pages/ExplorePost'; 
import StoryViewer from "./components/StoryViewer";
import CombinedChatPage from "./components/Chat";
import SearchPage from "./Pages/SearchPage";
import Logout from "./Pages/Logout";

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while checking authentication
  }

  return (
   
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={isAuthenticated ? <Homepage /> : <Navigate to="/login" />} />
        <Route path="/story" element={isAuthenticated ? <StoryComponent /> : <Navigate to="/login" />} />
        <Route path="/search" element={isAuthenticated ? <SearchPage /> : <Navigate to="/login" />} />
        <Route path="/story/:storyId" element={isAuthenticated ? <StoryViewer /> : <Navigate to="/login" />} />
        <Route path="/chat" element={isAuthenticated ? <CombinedChatPage /> : <Navigate to="/login" />} />
        <Route path="/profile/:userId" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/explore" element={isAuthenticated ? <ExplorePost /> : <Navigate to="/login" />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
 
  );
}

export default App;
