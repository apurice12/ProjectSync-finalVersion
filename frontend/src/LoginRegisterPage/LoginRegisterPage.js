import React, { useState, useEffect } from 'react';
import './LoginRegisterPage.css';
import { useNavigate } from 'react-router-dom';

const LoginRegisterPage = () => {
  // State to toggle between login and registration forms
  const [showLogin, setShowLogin] = useState(true);

  // Function to scroll to a specific section
  const scrollToSection = (sectionId) => {
    document.querySelector(sectionId).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app">
      <NavBar setShowLogin={setShowLogin} scrollToSection={scrollToSection} />

        <div className="section1">
          <div className="wrapper">
            {showLogin ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>
      </div>
      
  );
};

const NavBar = ({ setShowLogin }) => {
    // Function to handle click event for scrolling
    const scrollToSection = (sectionId) => {
      const section = document.querySelector(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    };
  
    // Function to handle sign in, sign up, and contact actions
    const handleAuthAction = (showLoginForm) => {
      setShowLogin(showLoginForm);
      scrollToSection('#section-home'); // Scrolls to the home section upon action
    };
  
    return (
      <nav className="nav">
        <div className="nav-logo">
          <p>ProjectSync.</p>
        </div>
        <div className="nav-menu" id="navMenu">
          
        </div>
        <div className="nav-button">
          <button className="btn white-btn" onClick={() => handleAuthAction(true)}>Sign In</button>
          <button className="btn" onClick={() => handleAuthAction(false)}>Sign Up</button>
        </div>
      </nav>
    );
  };

  const LoginForm = ({ onSuccess }) => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    useEffect(() => {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        // User is already logged in, redirect to the main page
        navigate('/mainpage');
      }
    }, [navigate]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setCredentials((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
  
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      };

      try {
        const response = await fetch('http://localhost:8080/login', requestOptions);
  
        // Log the response for debugging
        console.log('Login response:', response);
  
        if (!response.ok) {
          throw new Error('Login failed. Please check your credentials.');
        }
  
        const data = await response.json();
  
        // Log the received token for debugging
        console.log('Received JWT token:', data.token);
  
        // Store the token in local storage
        localStorage.setItem('jwtToken', data.token);
  
        // Redirect to '/mainpage'
        navigate('/mainpage');
      } catch (error) {
        console.error('Login error:', error);
        setError(error.message || 'An error occurred. Please try again.');
      }
  
    };
 

    return (
        <div className="login-container" id="login">
            <form onSubmit={handleSubmit}>
                <div className="top">
                    <span>Don't have an account? <a href="#">Sign Up</a></span>
                    <header>Login</header>
                </div>
                {error && <p className="error">{error}</p>}
                <div className="input-box">
                    <input type="email" className="input-field" placeholder="Email" name="email" value={credentials.email} onChange={handleChange} required />
                    <i className="bx bx-envelope"></i>
                </div>
                <div className="input-box">
                    <input type="password" className="input-field" placeholder="Password" name="password" value={credentials.password} onChange={handleChange} required />
                    <i className="bx bx-lock-alt"></i>
                </div>
                <div className="input-box">
                    <input type="submit" className="submit" value="Sign In" />
                </div>
            </form>
        </div>
    );
};


  const RegisterForm = () => {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      screenName:'',
      password: '',
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      };
  
      try {
        const response = await fetch('http://localhost:8080/api/v1/registration', requestOptions);
        if (!response.ok) {
          throw new Error('Failed to register. Please try again later.');
        }
        const data = await response.json();
        console.log('Registration successful:', data);
        // Handle successful registration here (e.g., redirect or show success message)
      } catch (error) {
        console.error('Registration error:', error);
        // Handle registration error here (e.g., show error message)
      }
    };
  
    return (
      <form className="register-container" id="register" onSubmit={handleSubmit}>
        <div className="top">
          <span>Have an account? <a href="#">Login</a></span>
          <header>Sign Up</header>
        </div>
        <div className="two-forms">
          <div className="input-box">
            <input type="text" className="input-field" placeholder="First name" name="firstName" value={formData.firstName} onChange={handleChange} />
            <i className="bx bx-user"></i>
          </div>
          <div className="input-box">
            <input type="text" className="input-field" placeholder="Last name" name="lastName" value={formData.lastName} onChange={handleChange} />
            <i className="bx bx-user"></i>
          </div>
        </div>
        <div className="two-forms">
        <div className="input-box">
          <input type="text" className="input-field" placeholder="Email" name="email" value={formData.email} onChange={handleChange} />
          <i className="bx bx-envelope"></i>
          </div>
          <div className="input-box">
            <input type="text" className="input-field" placeholder="Username" name="screenName" value={formData.screenName} onChange={handleChange} />
            <i className="bx bx-user"></i>
          </div>
        </div>
        
        <div className="input-box">
          <input type="password" className="input-field" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
          <i className="bx bx-lock-alt"></i>
        </div>
        <div className="input-box">
          <input type="submit" className="submit" value="Register" />
        </div>
      </form>
      
    );
  };


export default LoginRegisterPage;