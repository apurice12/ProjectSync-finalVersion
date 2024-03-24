import logo from './logo.svg';
import './App.css';
import LoginRegisterPage from './LoginRegisterPage/LoginRegisterPage';
import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';
import MainPage from './MainPage/MainPage';
import Navbar from './Navbar/Navbar';
import React, { useEffect, useState } from 'react';
import PostPage from './PostPage/PostPage';
import AddPost from './AddPost/AddPost';
import Collaborators from './Collaborators/Collaborators';
import MyProfile from './MyProfile/MyProfile';
// A wrapper component to use the useLocation hook
function AppWithRouter() {
  const location = useLocation();
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    // Hide the Navbar on the LoginRegisterPage
    setShowNavbar(location.pathname !== "/");
  }, [location]);

  return (
    <div className="App">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LoginRegisterPage />} />
        <Route path="/mainpage" element={<MainPage />} />
        <Route path="/posts" element={<PostPage />} />
        <Route path="/addpost" element= {<AddPost />} />
        <Route path="/collaborators" element= {<Collaborators />} />
        <Route path="/myprofile" element = {<MyProfile />} />
      </Routes>
    </div>
  );
}

// Update your App component to include AppWithRouter
function App() {
  return (
    <BrowserRouter>
      <AppWithRouter />
    </BrowserRouter>
  );
}

export default App;
