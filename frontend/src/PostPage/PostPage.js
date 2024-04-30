import React, { useEffect, useState } from 'react';
import './PostPage.css';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { FaThList, FaLaptopCode, FaBusinessTime, FaBook, FaAtom, FaPencilAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {Modal, Button, Form} from 'react-bootstrap';
const PostPage =() => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top of the page on component mount
  }, []);
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const [category, setCategory] = useState("All Categories");
    const [categoryModal, setCategoryModal] = useState("All Categories");
    const [capacity, setCapacity] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [activeApplyComment, setActiveApplyComment] = useState(null);
  const [isApplyDivVisible, setIsApplyDivVisible] = useState(false);
  const [applicationContent, setApplicationContent] = useState("");
  
    const handleClose = () => setShowModal(false);
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
          const response = await fetch(`http://localhost:8080/api/user/${userId}`, {
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
              ? `http://localhost:8080/api/comments`
              : `http://localhost:8080/api/comments/${encodeURIComponent(
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

      const handleApplyClick = (comment) => {
        setActiveApplyComment(comment);
        setShowModal(true);
      };
      const handleApplySubmit = async () => {
        // Example POST request to your backend API endpoint
        const commentId = activeApplyComment?.id; // Assuming this is the ID of the post/comment being applied to
        if (!commentId || !applicationContent.trim()) {
          alert("Please fill in your application.");
          return;
        }
        
        try {
          const response = await fetch(`http://localhost:8080/api/user/apply/${commentId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              appliant: userDetails.screenName,
              content: applicationContent,
              appliantAboutMe: userDetails.aboutMe,
              commentRoom: comment.commentRoom
            }),
          });
          
          if (!response.ok) {
            throw new Error("Failed to apply");
          }
          
          alert("Applied successfully!");
          // Optionally, reset applicationContent and refresh comments or applications to show changes
          setApplicationContent(""); // Reset application content
          setShowModal(false); // Close modal
          // Refresh your application state as needed
        } catch (error) {
          console.error("Error applying to comment:", error);
          alert("You have already applied for this.");
          setApplicationContent(""); // Reset application content
        }
      };
      return (
        <div className="lp-container">
          <div className="lp-sidebar">
            <div className='Categories'>Categories</div>
            <hr />
            <ul className="lp-category-list">
  <li><a href="#all" onClick={(e) => { e.preventDefault(); setCategory("All Categories"); }}><FaThList /> All Categories</a></li>
  <li><a href="#it" onClick={(e) => { e.preventDefault(); setCategory("IT"); }}><FaLaptopCode /> IT</a></li>
  <li><a href="#business" onClick={(e) => { e.preventDefault(); setCategory("Business"); }}><FaBusinessTime /> Business</a></li>
  <li><a href="#education" onClick={(e) => { e.preventDefault(); setCategory("Education"); }}><FaBook /> Education</a></li>
  <li><a href="#science" onClick={(e) => { e.preventDefault(); setCategory("Science"); }}><FaAtom /> Science</a></li>
</ul>



      
            <Link id="postButton" className='btn btn-primary' to="/addpost">
              <FaPencilAlt /> Add a post {/* Icon added here */}
            </Link>
          </div>
          <div id="lp-latest-posts-container" className="lp-latest-posts-container">
            <div className="lp-search-container">
              <input type="search" placeholder="Search posts..." className="lp-search-bar" />
              <button type="button">Search</button>
            </div>
            <div className="lp-comments-grid-container">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="lp-comment-card">
                    <div className="lp-post-card-header">
                      {comment.screenName === userDetails.screenName ? (
                        <div className="lp-user-details">
                          <img
                             src={`http://localhost:8080/api/user/${comment.screenName}/picture`}
                            alt="Profile"
                            className="lp-user-image"
                            onError={(e) => (e.target.src = 'profilePicture.png')}
                          />
                          <em>You</em>
                        </div>
                      ) : (
                        <div className="lp-user-details">
                          <img
                             src={`http://localhost:8080/api/user/${comment.screenName}/picture`}
                            alt="Profile"
                            className="lp-user-image"
                            onError={(e) => (e.target.src = 'profilePicture.png')}
                          />
                          <em>{comment.screenName}</em>
                        </div>
                      )}
                      <span className="lp-comment-date">{new Date(comment.createdDate).toLocaleString()}</span>
                    </div>
                    <div className="lp-comment-card-body">
                      <p className="lp-comment-content">
                        {comment.content}
                      </p>
                      <div className="lp-comment-footer">
  {comment.currentCapacity === comment.capacity ? (
    <span className="badge bg-warning text-dark">Enrollment full</span>
  ) : (
    <button 
      className="view-button" 
      style={{ visibility: comment.screenName === userDetails.screenName ? 'hidden' : 'visible' }}
      onClick={() => handleApplyClick(comment)}
    >
      Apply
    </button>
  )}
                       
                        <div className="lp-comment-info">
                          <span className="lp-category-tag">
                            Category: {comment.category}
                          </span>
                          <span className={`lp-capacity-info ${comment.currentCapacity < comment.capacity ? "text-success" : "text-danger"}`}>
                            <i className="bi bi-person-fill"></i> {comment.currentCapacity}/{comment.capacity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="lp-no-posts">No posts available at the moment.</p>
              )}
            </div>
          </div>
          <Modal show={showModal} onHide={handleClose} size="lg" dialogClassName="custom-modal-width">
  <Modal.Header closeButton>
    <Modal.Title>Apply to Post ID#{activeApplyComment?.id}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p>Applying to: {activeApplyComment?.screenName}</p>
    <textarea
  id="apply-content"
  className="form-control"
  rows="15"
  placeholder="Why do you want to take part in this project?..."
  
  value={applicationContent} // Use the state
  onChange={(e) => setApplicationContent(e.target.value)} // Update the state on change
/>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>Close</Button>
    <Button variant="primary" onClick={handleApplySubmit}>Submit Application</Button>
  </Modal.Footer>
</Modal>
        </div>
      
      );
      
      
      
      
      
}

export default PostPage