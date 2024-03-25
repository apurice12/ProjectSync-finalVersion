import React, { useEffect, useState } from 'react';
import './MainPage.css';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile, faFolderOpen, faHeadset, faUsers } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
const MainPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top of the page on component mount
  }, []);
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [categoryModal, setCategoryModal] = useState("All Categories");
  const [capacity, setCapacity] = useState("");



  // Fetch user details from JWT token stored in localStorage
  const [userDetails, setUserDetails] = useState({
    id: '',
    firstName: '',
    lastName: '',
    country: '',
    occupation: '',
    screenName: '',
    email: '',
    aboutMe: ''
  });
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        fetchUserDetails(decoded.sub); // Assuming 'sub' is where you store the user ID
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(`https://projectsync-finalversion.onrender.com/api/user/${userId}`, {
        method: 'GET',

      });
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      const details = await response.json();
      setUserDetails({
        ...userDetails,
        id: details.id,
        firstName: details.firstName,
        lastName: details.lastName,
        country: details.country,
        occupation: details.occupation,
        screenName: details.screenName,
        email: details.email,
        aboutMe: details.aboutMe
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
      // Handle error, maybe navigate back to login or show an error message
    }
  };
  // Fetch comments
  useEffect(() => {
    fetchComments();
  }, [category]);

  const fetchComments = async () => {
   
    try {
      // Construct the URL based on the category
      // If 'All Categories' is selected, you might not want to append a category filter in your request
      const url =
        category === "All Categories"
          ? `https://projectsync-finalversion.onrender.com/api/comments`
          : `https://projectsync-finalversion.onrender.com/api/comments/${encodeURIComponent(
              category
            )}`;

      const response = await fetch(url, {
        headers: {

        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      setComments(data);
      setCategoryModal("All Categories");
      setCapacity("");
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className='main-content'>
    <div className="hero-section">
      <div className="text-area1">
        <h1>Welcome, {userDetails.firstName}</h1>
        <p>Join a vibrant community of innovators and creators with ProjectSync. Find your next great collaboration in just a few clicks.</p>
        <Link to="/posts" className="btn-get-started">Find Collaborators →</Link>
      </div>
      <div className="image-area">
        {/* Ensure you have an image called 'illustration.png' in your public folder */}
        <img src="/features-2.png" alt="Illustration" />
      </div>
    </div>

   

    <div className='about-section'>
        <div className="image-area">
          {/* Image for the about us section */}
          <img src="/features-3.png" alt="About Us" />
        </div>
        <div className="text-area">
          <h1>About Us ✨</h1>
          <p>
            ProjectSync is where students unite to turn ideas into impactful projects. 🌟 It's a hub for innovation, a space where the leaders of tomorrow come together to solve today's challenges.
          </p>
          <ul>
  <li>🤝 <strong>Connect:</strong> Find and connect with students who share your interests and goals.</li>
  <li>🔨 <strong>Collaborate:</strong> Team up to work on projects, combining your strengths for greater success.</li>
  <li>📚 <strong>Learn:</strong> Learn from each other, gaining insights and knowledge through shared experiences.</li>
  <li>💡 <strong>Innovate:</strong> Use your collective creativity to tackle challenges and come up with innovative solutions.</li>
</ul>

        
        </div>
     
      </div>
      <p className="latest-posts-title">🌍 Latest Posts:</p>
      <div className="latest-posts-container">
  
  <div className="comments-grid-container">
    {comments.length > 0 ? (
      comments.map((comment) => (
        <div key={comment.id} className="comment-card">
          <div className="post-card-header">
            {comment.screenName === userDetails.screenName ? (
              <div className="user-details">
                <img
                  src={`https://projectsync-finalversion.onrender.com/api/user/${comment.screenName}/picture`}
                  alt="Profile"
                  className="user-image"
                  onError={(e) => (e.target.src = 'profilePicture.png')}
                />
                <em>You</em>
              </div>
            ) : (
              <div className="user-details">
                <img
                  src={`https://projectsync-finalversion.onrender.com/api/user/${comment.screenName}/picture`}
                  alt="Profile"
                  className="user-image"
                  onError={(e) => (e.target.src = 'profilePicture.png')}
                />
                <em>{comment.screenName}</em>
              </div>
            )}
            <span className="comment-date">{new Date(comment.createdDate).toLocaleString()}</span>
          </div>
          <div className="comment-card-body">
          <p className="comment-content">
                {isMobile
                  ? comment.content.length > 200
                    ? `${comment.content.slice(0, 200)}...`
                    : comment.content
                  : comment.content.length > 400
                    ? `${comment.content.slice(0, 400)}...`
                    : comment.content}
              </p>
        <div className="comment-info">
  <span className="category-tag">
    Category: {comment.category}
  </span>
  <span className={`capacity-info ${comment.currentCapacity < comment.capacity ? "text-success" : "text-danger"}`}>
    <i className="bi bi-person-fill"></i> {comment.currentCapacity}/{comment.capacity}
  </span>
  </div>
</div>

</div>

      ))
    ) : (
      <p className="no-posts">No posts available at the moment.</p>
    )}
  </div>
</div>
<div className="statistics-container">
      <div className="statistic">
        <FontAwesomeIcon icon={faSmile} className="icon" />
        <h2>232</h2>
        <p>Users</p>
      </div>
      <div className="statistic">
        <FontAwesomeIcon icon={faFolderOpen} className="icon" />
        <h2>521</h2>
        <p>Open Projects</p>
      </div>
      <div className="statistic">
      <FontAwesomeIcon icon={faCheckCircle} className="icon" />
      <h2>3</h2>
      <p>Completed Projects</p>
    </div>
      <div className="statistic">
        <FontAwesomeIcon icon={faUsers} className="icon" />
        <h2>2157</h2>
        <p>Open positions for projects </p>
      </div>
    </div>
      <div class="copyright">
      <footer className="text-center text-light py-4" id="footer-content">

        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <em><h3>Contact Us</h3></em>
              <em><p>Email: ProjectSync@gmail.com</p></em>
              <em><p>Phone: +40 720 605 262</p></em>
              <em><p>Address: 18 Videle, Ilfov, Voluntari</p></em>
            </div>
            <div className="col-md-4">
              <em><h3>Follow Us</h3></em>
              <em><p>Discord: @ProjectSync</p></em>
              <em><p>Twitter: @ProjectSync</p></em>
              <em><p>Instagram: ProjectSyncOfficial</p></em>
            </div>
            <div className="col-md-4">
              <em><h3>New Column</h3></em>
              <em><p>Ma mai gandesc ce scriu aici.</p></em>
              <em><p>Ma mai gandesc ce scriu aici.</p></em>
              <em><p>Ma mai gandesc ce scriu aici.</p></em>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-12">
              <p>&copy; 2024 ProjectSync. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
      </div>
   </div>

  );
}

export default MainPage;
