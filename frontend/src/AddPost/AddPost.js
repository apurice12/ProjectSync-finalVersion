
import React, { useEffect, useState } from 'react';
import './AddPost.css';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Corrected import
import { Link } from 'react-router-dom';
const AddPost = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top of the page on component mount
  }, []);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('');
  const [capacity, setCapacity] = useState('');
  const navigate = useNavigate();
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

  const handleSubmit = async (event) => { // Renamed to handleSubmit
    event.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await fetch(
        `https://projectsync-finalversion.onrender.com/api/comments/user/${userDetails.email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: comment,
            screenName: userDetails.screenName,
            category: category, // Corrected to category
            capacity: capacity,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to post comment");
      }
      alert("Comment posted successfully!");
      setComment("");
      setCategory(""); // Reset category to default value if needed
      setCapacity(""); // Reset capacity to default value if needed
      // fetchComments(); // Uncomment this if the function is defined
      // resetForm(); // Implement or remove this call
      // handleCloseAddPostModal(); // Implement or remove this call
      navigate('/posts');
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  // ... the rest of your component remains unchanged
  const handleCapacityChange = (event) => setCapacity(event.target.value);
  const handleCategoryChange=(event) =>setCategory(event.target.value);

  return (
    <div className="add-post-container">
      <h2 className='title-post'>Write your project idea</h2>
      <Form onSubmit={handleSubmit}>
     
        <Form.Group className="mb-3">
         
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={12}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a post..."
          
          />
        </Form.Group>

        <Form.Group className="mb-3" >
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            value={category}
            onChange={handleCategoryChange}
  
          >
            <option value="">Select Category</option>
            <option value="IT">IT</option>
            <option value="Business">Business</option>
            <option value="Education">Education</option>
            <option value="Science">Science</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" >
          <Form.Label>Capacity</Form.Label>
          <Form.Control
            type="number"
            placeholder="Number of users"
            value={capacity}
            onChange={handleCapacityChange}
   
          />
        </Form.Group>
<div className='button-group-posts'>
<Button variant="secondary" type="button" onClick={() => navigate('/posts')}>
      Close
    </Button>
        <Button variant="primary" type="submit">
          Submit Post
        </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddPost;
