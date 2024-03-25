import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faUpload } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import './MyProfile.css'; // Ensure you have the updated styles in MyProfile.css
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faStar as faSolidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FaCheck, FaRandom, FaTimes, FaUserCircle } from 'react-icons/fa'; // Assuming you're using React Icons for icons

const MyProfile = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top of the page on component mount
  }, []);
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null); // For storing the selected file
    const [applications, setApplications] = useState([]);
    const [expandedCard,setExpandedCard]=useState();
    const [showModal, setShowModal] = useState(false);
    const [comment, setComment] = useState("");
    const [showApplicationsModal, setShowApplicationsModal] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
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
      const handleChange = (event) => {
        const { name, value } = event.target;
        setUserDetails(prevDetails => ({
          ...prevDetails,
          [name]: value
        }));
      };

      const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
      
        try {
          const response = await fetch(`https://projectsync-finalversion.onrender.com/api/user/${userDetails.id}`, {
            method: 'PUT', // Specify the request method
            headers: {
              'Content-Type': 'application/json', // Specify the content type in the headers
    
            },
            body: JSON.stringify(userDetails), // Convert the formData object to JSON format
          });
      
          if (!response.ok) { // Check if the request was unsuccessful
            throw new Error('Network response was not ok');
          }
      
          const data = await response.json(); // Parse the JSON response
          console.log(data); // Handle the response data
          setShowEditProfileModal(false);
    
          alert('Profile updated successfully.');
        } catch (error) {
          console.error('Error updating profile:', error);
          alert('Failed to update profile.');
        }
      };
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

      const [applicantsList, setApplicantsList] = useState([]);
      useEffect(() => {
        // Construct the URL with the screenName
        const url = `https://projectsync-finalversion.onrender.com/api/user/apply/by-appliant/${userDetails.screenName}`;
    
        const fetchData = async () => {
          try {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            // Assuming the API returns an array of applicants
            setApplicantsList(data);
          } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
          }
        };
    
        fetchData();
      }, [userDetails.screenName]); 
      
      const handleUploadClick = async () => {
        if (!selectedFile) {
          alert("Please select a file first.");
          return;
        }
      
        const formData = new FormData();
        formData.append("file", selectedFile);
      
        try {
          const response = await fetch(`https://projectsync-finalversion.onrender.com/api/user/${userDetails.screenName}/profile-picture`, {
            method: 'POST',
            body: formData,
    
          });
      
          if (!response.ok) {
            throw new Error('Failed to upload profile picture.');
          }
      
          const result = await response.json();
          alert(result.message); // Assuming the server responds with a JSON object containing a message field
          
        } catch (error) {
          console.error('Error uploading the profile picture:', error);
          window.location.reload();
          alert('Profile picture uploaded succesfully!')
          
        }
      };

      function handleFileChange(event) {
        const file = event.target.files[0]; // Get the selected file
        if (file) {
          setSelectedFile(file); // Update the state with the selected file
      
          // Optionally, if you want to immediately display the selected image
          const reader = new FileReader();
          reader.onload = function(e) {
            document.getElementById('profile-picture').src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      }
      const [comments, setComments] = useState([]);

      useEffect(() => {
        const fetchComments = async () => {
          const response = await fetch(`https://projectsync-finalversion.onrender.com/api/comments/user/${userDetails.email}`);
          const data = await response.json();
          setComments(data);
        };
    
        fetchComments();
      }, [userDetails.email]); // This ensures the fetch operation is re-run if the user details change
       
  const handleShowModal = (comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.content);
    setTempEditingText(comment.content); // Initialize temporary editing text
    setShowModal(true);
  };
  const updateCommentsAfterEdit = (commentId, newText) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId ? { ...comment, content: newText } : comment
      )
    );
  };
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [tempEditingText, setTempEditingText] = useState(""); // Temporary storage for editing text
  const handleEditComment = async (commentId, newText) => {
  
    try {
      const response = await fetch(
        `https://projectsync-finalversion.onrender.com/api/comments/${commentId}`,
        {
          method: "PUT", // or 'PATCH'
          headers: {
            "Content-Type": "application/json",
      
          },
          body: JSON.stringify({ content: newText }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to edit comment");
      }
      alert("Comment updated successfully!");
      // Here you might want to re-fetch all comments or update the local state
      updateCommentsAfterEdit(commentId, newText); // Update local state
      setShowModal(false);
      setEditingCommentId(null);

    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };
  const handleDeleteComment = async (commentId) => {
    
   
    try {
      const response = await fetch(
        `https://projectsync-finalversion.onrender.com/api/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
      
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }
      alert("Comment deleted successfully!");
      fetchComments(); // Reload comments
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  const fetchComments = async () => {
    try {
      const response = await fetch(
        `https://projectsync-finalversion.onrender.com/api/comments/user/${userDetails.email}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);
  const handleShowApplications = async (commentId) => {
    // Prevent default action if this function is called within an event handler
    // e.preventDefault();
    setShowApplicationsModal(true); // Open the modal
    try {
      const response = await fetch(`https://projectsync-finalversion.onrender.com/api/user/apply/by-comment/${commentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      const applications = await response.json();
      // Assuming applications is an array of objects where each object has an appliant property
      setApplications(applications);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const [inProgressCounts, setInProgressCounts] = useState({});

useEffect(() => {
  // Function to fetch in-progress count for a single comment
  const fetchInProgressCount = async (commentId) => {
    try {
      const response = await fetch(`https://projectsync-finalversion.onrender.com/api/user/apply/count/in-progress/${commentId}`);
      const count = await response.json(); // assuming the response is just the count
      return count;
    } catch (error) {
      console.error('Failed to fetch in-progress count', error);
      return 0; // Return 0 or some error value in case of failure
    }
  };

  // Fetch counts for all comments and update state
  const fetchAllCounts = async () => {
    const counts = await Promise.all(comments.map(comment => fetchInProgressCount(comment.id)));
    const countsMap = comments.reduce((acc, comment, index) => {
      acc[comment.id] = counts[index];
      return acc;
    }, {});
    setInProgressCounts(countsMap);
  };

  fetchAllCounts();
}, [comments]);

const [visibleContentIndex, setVisibleContentIndex] = useState(null);
const toggleContentVisibility = (index) => {
  if (visibleContentIndex === index) {
    setVisibleContentIndex(null); // Hide the details if they are already visible
  } else {
    setVisibleContentIndex(index); // Show the details for the clicked application
  }
};
const acceptApplication = async (applicationId) => {
   
  
  try {
    const response = await fetch(`https://projectsync-finalversion.onrender.com/api/user/apply/${applicationId}/accept`, {
      method: 'PUT',
      headers: {
  
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to accept application');
    }

    // Update the application's isAccepted state
   

    console.log("Application accepted successfully");
    setVisibleContentIndex(null); // Optionally, hide the details if shown
    setShowApplicationsModal(false);
  } catch (error) {
    console.error("Error accepting application:", error);
  }
};
const declineApplication = async (applicationId) => {
  

  try {
    const response = await fetch(`https://projectsync-finalversion.onrender.com/api/user/apply/${applicationId}/decline`, {
      method: 'PUT',
      headers: {
 
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to decline application');
    }

    // Update the application's isAccepted state
    setApplications(prevApplications => prevApplications.map(application => {
      if (application.id === applicationId) {
        return { ...application, accept: false };
      }
      return application;
    }));

    console.log("Application declined successfully");
    setVisibleContentIndex(null); // Optionally, hide the details if shown
    setShowApplicationsModal(false);
  } catch (error) {
    console.error("Error decline application:", error);
  }
};

      return (
        <div className="profile-container">
          <div className="profile-row">
            <div className="profile-col-lg-4 col-md-12">
              <div className="profile-card profile-z-depth-3">
                <div className="profile-card-body profile-text-center profile-bg-primary profile-rounded-top">
                  <div className="profile-user-box">
                    <img
                      src={`https://projectsync-finalversion.onrender.com/api/user/${userDetails.screenName}/picture`}
                      alt="Profile"
                      className="profile-picture-img"
                      id="profile-picture"
                      onError={(e) => (e.target.src = 'profilePicture.png')}
                    />
                  </div>
                  <h5 className="profile-name profile-text-white">{userDetails.firstName} {userDetails.lastName}</h5>
                  <h6 className="profile-title profile-text-light">{userDetails.screenName}</h6>
                </div>
                <ul className="profile-list-group">
                <div className="buttons-neu">
                <button className='btn btn-primary-neu' id="edit-profile-button" onClick={() => setShowEditProfileModal(true)}>
        <FontAwesomeIcon icon={faEdit} /> Edit Profile
      </button>
               
              <input
                type="file"
                id="file-input"
                accept="image/*"
                onChange={handleFileChange}
                style={{display: 'none'}}
              />
              <label htmlFor="file-input" className="upload-button-label btn-sm" id="edit-profile-button"> 
                Choose Photo
              </label>
              <button
                className="btn btn-primary btn-sm"
                style={{ borderRadius: '20px' }}
                onClick={handleUploadClick}
              >
                Upload/Edit Photo
              </button>
            </div>

                </ul>
       
                <div className="profile-stats-body">
                  <div className="profile-stats-row">
                    <div className="profile-stats-col text-center">
                      <h4 className="profile-stats-value">154</h4>
                      <small className="profile-stats-label">Projects Done</small>
                    </div>
                    <div className="profile-stats-col text-center">
                      <h4 className="profile-stats-value">2</h4>
                      <small className="profile-stats-label">Total Posts</small>
                    </div>
                    <div className="profile-stats-col text-center">
                      <h4 className="profile-stats-value">9.1k</h4>
                      <small className="profile-stats-label">Total Applications</small>
                    </div>
                  </div>
                 
             
             
                
             
                </div>
              </div>
            </div>
            
          </div>
          <div className="content-col-lg-12">
                    
                    <div id="user-applications-section"><h2>Your Applications:</h2></div>
                    <div className="section-neu applications-neu">
                    <div className="ProjectSync-horizontal-scroll-container">
                      {applicantsList.map((applicant, index) => (
                        <div
                          key={index}
                          className="ProjectSync-card card-custom mx-2"
                        >
                          <div className="ProjectSync-card-header">
                            <div className="ProjectSync-profile-section">
                              <img
                                src={`https://projectsync-finalversion.onrender.com/api/user/${applicant.owner}/picture`}
                                alt="Profile"
                                className="ProjectSync-round-image me-3"
                                onError={(e) => (e.target.src = 'profilePicture.png')}
                              />
                              <h3 className="ProjectSync-card-title" id="PostIdProfile">{applicant.owner}</h3>
                            </div>
                            <span className={`ProjectSync-badge ${
                              applicant.accepted === "true" ? 'badge-success' : applicant.accepted === "false" ? 'badge-danger' : 'badge-warning'
                            }`}>
                              {applicant.accepted === "true" ? 'Accepted' : applicant.accepted === "false" ? 'Rejected' : 'In Progress'}
                            </span>
                          </div>
                          
                          <div className="ProjectSync-card-content">
                  
                          <p className="ProjectSync-card-text">
        {applicant.comment.content.length > 830
          ? `${applicant.comment.content.slice(0, 830)}...`
          : applicant.comment.content}
      </p>
      
                            
                          </div>
          
                          {applicant.accepted === "true" && (
                            <div className="ProjectSync-room-info">
                           <p className="text-success" id="room">
   <span
             onClick={() => navigate(`/collaborators`)}
             style={{cursor: 'pointer'}}
           >
             Room ID: {applicant.comment.commentRoom}
           </span>
                                <p>Add this Room ID to Collaborators and start sending messages.</p>
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
      
                  </div>
                  <div className="content-col-lg-12">

                  <div id="user-applications-section"><h2>Your Posts:</h2></div>
                  <div className="section-neu applications-neu">
      <div className="ProjectSync-horizontal-scroll-container">
        {comments.map((comment, index) => (
          <div
            key={index}
            className="ProjectSync-card card-custom mx-2"
          >
            <div className="ProjectSync-card-header">
              <div className="ProjectSync-profile-section">
                <img
                  src={`https://projectsync-finalversion.onrender.com/api/user/${userDetails.screenName}/picture`}
                  alt="Profile"
                  className="ProjectSync-round-image me-3"
                  onError={(e) => (e.target.src = 'profilePicture.png')}
                />
                <h3 className="ProjectSync-card-title">{comment.screenName}</h3>
              </div>
            <div className="ProjectSync-action-icons">
            <div className="ProjectSync-action-icons" style={{ display: 'flex', alignItems: 'center' }}>
  {/* View (Eye) Button */}
  <button 
    style={{ 
      background: '#f0f0f0', 
      border: '1px solid #ccc', 
      borderRadius: '50%', 
      padding: '5px', 
      margin: '0 8px 0 0', 
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transition: 'background 0.3s ease-in-out, transform 0.2s ease',
    }} 
    onClick={() => handleShowModal(comment)}
    aria-label="View comment"
    onMouseOver={(e) => (e.currentTarget.style.background = '#e2e2e2', e.currentTarget.style.transform = 'scale(1.1)')}
    onMouseOut={(e) => (e.currentTarget.style.background = '#f0f0f0', e.currentTarget.style.transform = 'scale(1)')}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#3B71CA" viewBox="0 0 16 16">
  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.482-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.173 8z"/>
  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM8 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
</svg>
  </button>
  
  {/* Delete Button */}
  <button 
    style={{ 
      background: '#f0f0f0', 
      border: '1px solid #ccc', 
      borderRadius: '50%', 
      padding: '5px', 
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transition: 'background 0.3s ease-in-out, transform 0.2s ease',
    }} 
    onClick={() => handleDeleteComment(comment.id)}
    aria-label="Delete comment"
    onMouseOver={(e) => (e.currentTarget.style.background = '#ffdddd', e.currentTarget.style.transform = 'scale(1.1)')}
    onMouseOut={(e) => (e.currentTarget.style.background = '#f0f0f0', e.currentTarget.style.transform = 'scale(1)')}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  </button>
</div>
</div>


              {/* Assuming a badge or status isn't relevant for comments, remove or adjust this span */}
            </div>
            <div className="ProjectSync-card-content">
              <p className="ProjectSync-card-text">
                {comment.content.length > 700
                  ? `${comment.content.slice(0, 700)}...`
                  : comment.content}
              </p>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <button
          style={{
            background: ' #4154f1',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 16px',
            cursor: 'pointer',
            transition: 'background 0.3s ease',
            marginBottom: 10
          }}
          onClick={() => handleShowApplications(comment.id)}
        >
          Show Applications
          <span className="notification-badge">{inProgressCounts[comment.id] || 0}</span>
        </button>
        </div>
            {/* You can add more content or conditional rendering based on your data structure */}
          </div>
        ))}
      </div>
    </div>
                </div>
                
      <Modal size="lg"show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Post ID #{comment.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            className="form-control"
            rows="15"
            value={tempEditingText}
            onChange={(e) => setTempEditingText(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => handleEditComment(editingCommentId, tempEditingText)}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Modal show={showApplicationsModal} onHide={() => setShowApplicationsModal(false)} size="lg" className="custom-modal">
  <Modal.Header closeButton className="modal-header-custom">
    <Modal.Title>Applications</Modal.Title>
  </Modal.Header>

  <Modal.Body className="modal-body-custom">
  {applications.length > 0 ? (
  applications.map((application, index) => (
    <div key={index} className="card mb-3 application-card">
      <div className="card-body">
        <div className="application-flex-container">
          <div className="profile-and-name">
            <img
              src={`https://projectsync-finalversion.onrender.com/api/user/${application.appliant}/picture`}
              alt="Profile"
              className="profile-image"
              onError={(e) => (e.target.src = 'profilePicture.png')}
            />
            <h3 className="card-title">{application.appliant}</h3>
          </div>
          {application.accepted === "true" ? (
            <svg className="status-icon success" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="green" viewBox="0 0 16 16">
              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
            </svg>
          ) : application.accepted === "false" ? (
            <svg className="status-icon danger" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="red" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M2.854 2.146a.5.5 0 0 1 .707 0l10.5 10.5a.5.5 0 0 1-.707.708l-10.5-10.5a.5.5 0 0 1 0-.708z"/>
              <path fill-rule="evenodd" d="M13.354 2.146a.5.5 0 0 0-.707 0l-10.5 10.5a.5.5 0 0 0 .707.708l10.5-10.5a.5.5 0 0 0 0-.708z"/>
            </svg>
          ) : (
            <button className="btn btn-link p-0 text-decoration-none" onClick={() => toggleContentVisibility(index)}>
    <small>Click to view details</small>
  </button>
          )}
        </div>
        {visibleContentIndex === index && (
          <>
            <p className="application-content">{application.content}</p>
            <p className="application-about-title">About {application.appliant}:</p>
            <p className="application-about-content">{application.appliantAboutMe}</p>
            <div className="action-buttons">
              <Button variant="outline-success" onClick={() => acceptApplication(application.id)} className="accept-button">
                <FaCheck /> Accept
              </Button>
              <Button variant="outline-danger" onClick={() => declineApplication(application.id)} className="decline-button">
                <FaTimes /> Decline
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  ))
) : (
  <p>No applications found.</p>
)}
</Modal.Body>
  <Modal.Footer className="modal-footer-custom">
    <Button variant="secondary" onClick={() => setShowApplicationsModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>


      <Modal size="lg"show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            className="form-control"
            rows="20"
            value={tempEditingText}
            onChange={(e) => setTempEditingText(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => handleEditComment(editingCommentId, tempEditingText)}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal size="lg" show={showEditProfileModal} onHide={() => setShowEditProfileModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#f7f7f7', padding: '20px' }}>
  <form onSubmit={handleSubmit} style={{ color: '#212529' }}>
    <div className="row" style={{ marginBottom: '15px' }}>
      <div className="col-12 col-sm-6 mb-3">
        <label htmlFor="floatingFirstName" className="form-label" style={{ display: 'block', marginBottom: '8px' }}>First Name</label>
        <input
          type="text"
          className="form-control"
          id="floatingFirstName"
          placeholder="First Name"
          name="firstName"
          readOnly={true}
          value={userDetails.firstName}
          onChange={handleChange}
          style={{
            borderRadius: '20px',
            border: '1px solid #ced4da',
            padding: '.375rem .75rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#e9ecef', // Slightly different background for readonly field
          }}
        />
      </div>
      <div className="col-12 col-sm-6 mb-3">
        <label htmlFor="floatingLastName" className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Last Name</label>
        <input
          type="text"
          className="form-control"
          id="floatingLastName"
          placeholder="Last Name"
          name="lastName"
          readOnly={true}
          value={userDetails.lastName}
          onChange={handleChange}
          style={{
            borderRadius: '20px',
            border: '1px solid #ced4da',
            padding: '.375rem .75rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#e9ecef', // Slightly different background for readonly field
          }}
        />
      </div>
    </div>
    <div className="row">
      <div className="col-12 col-sm-6 mb-3">
        <label htmlFor="floatingEmail" className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Email</label>
        <input
          type="email"
          className="form-control"
          id="floatingEmail"
          placeholder="Email"
          name="email"
          readOnly={true}
          value={userDetails.email}
          onChange={handleChange}
          style={{
            borderRadius: '20px',
            border: '1px solid #ced4da',
            padding: '.375rem .75rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#e9ecef', // Slightly different background for readonly field
          }}
        />
      </div>
      <div className="col-12 col-sm-6 mb-3">
        <label htmlFor="floatingUsername" className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Username</label>
        <input
          type="text"
          readOnly={true}
          className="form-control"
          id="floatingUsername"
          placeholder="Username"
          name="screenName"
        
          value={userDetails.screenName}
          style={{
            borderRadius: '20px',
            border: '1px solid #ced4da',
            padding: '.375rem .75rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#e9ecef', // Slightly different background for readonly field
          }}
        />
      </div>
    </div>
    <div className="row">
      <div className="col-md-6 mb-3">
        <label htmlFor="floatingOccupation" className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Occupation</label>
        <input
          type="text"
          className="form-control"
          id="floatingOccupation"
          placeholder="Occupation"
          name="occupation"
          value={userDetails.occupation}
          onChange={handleChange}
          style={{
            borderRadius: '20px',
            border: '1px solid #ced4da',
            padding: '.375rem .75rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        />
      </div>
      <div className="col-md-6 mb-3">
        <label htmlFor="floatingCountry" className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Country</label>
        <input
          type="text"
          className="form-control"
          id="floatingCountry"
          placeholder="Country"
          name="country"
          value={userDetails.country}
          onChange={handleChange}
          style={{
            borderRadius: '20px',
            border: '1px solid #ced4da',
            padding: '.375rem .75rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        />
      </div>

      <div className="col-12 mb-3">
        <label htmlFor="floatingAboutMe" className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Talk about yourself, and your skills. You can also include links!</label>
        <textarea
          className="form-control"
          id="floatingAboutMe"
          rows="15"
          name="aboutMe"
          placeholder="Talk about yourself, and your skills..."
          value={userDetails.aboutMe}
          onChange={handleChange}
          style={{
            borderRadius: '20px',
            border: '1px solid #ced4da',
            padding: '.375rem .75rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        ></textarea>
      </div>
    </div>

    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
      <button
        className="btn btn-secondary"
        type="button"
        onClick={() => setShowEditProfileModal(false)}
        style={{
          borderRadius: '20px',
          padding: '.375rem .75rem',
          fontWeight: '500',
          margin: '0 4px',
          backgroundColor: '#6c757d',
          border: 'none',
        }}
      >
        Cancel
      </button>
      <button
        className="btn btn-primary"
        type="submit"
        style={{
          borderRadius: '20px',
          padding: '.375rem .75rem',
          fontWeight: '500',
          margin: '0 4px',
          color: 'white',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          cursor: 'pointer',
          border: 'none',

        }}
      >
        Submit
      </button>
    </div>
  </form>
</Modal.Body>

      </Modal>
                </div>
      )
    
    
    
    
};

export default MyProfile;