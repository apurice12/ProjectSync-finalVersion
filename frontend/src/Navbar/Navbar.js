import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom
import './Navbar.css'; // Make sure to create a Navbar.css file for styling
import { Link } from 'react-router-dom';
const Navbar = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleLogout = (e) => {
    e.preventDefault(); // Prevent default anchor action

    // Remove the token (adjust "authToken" to whatever key you're using)
    localStorage.removeItem('jwtToken');

    // Optionally clear other user data from storage/session

    // Redirect to the login page or wherever appropriate
    navigate('/');
  };

  return (
    <nav className="main-navbar">
      <div className="navbar-container">
        <Link to ="/" className="navbar-brand">ProjectSync.</Link>
        <div className="navbar-links">
          <Link to="/mainpage">Home</Link>
          <Link to="/posts">Posts</Link>
          <Link to="/collaborators">Collaborators</Link>
          {/* Update the Logout link to call handleLogout on click */}
          <a href="/logout" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i> Logout
          </a>
          <Link to="/myprofile" className="navbar-button">
            <i className="bi bi-person"></i> My Profile
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
