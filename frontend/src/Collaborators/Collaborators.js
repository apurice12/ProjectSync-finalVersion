import React, { useState, useEffect } from 'react';
import "./Collaborators.css";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const Collaborators = () => {
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentRoom, setCurrentRoom] = useState('');
  const [rooms, setRooms] = useState([null]);
  const [error, setError] = useState(null);
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
    // Function to fetch rooms for the current user
    const fetchRoomsForUser = async () => {
      try {
        const email = userDetails.screenName; // Adjust according to how you store the user's email
        const response = await axios.get(`https://projectsync-finalversion.onrender.com/users/chat/rooms/${userDetails.screenName}`);
        const userRooms = response.data;

        // Directly set fetched rooms without adding "UniversalRoom"
        setRooms([...new Set([...userRooms])]);
// Use Set to avoid duplicates, though backend should ensure uniqueness
        // Ensure the default "UniversalRoom" is included and merge with fetched rooms
        // This assumes the endpoint returns an array of room names/IDs
        setRooms([...new Set([...userRooms])]);
        // Avoid duplicates
      } catch (error) {
        console.error("Error fetching rooms:", error);
        // Handle error (e.g., show a message to the user)
      }
    };
  
    fetchRoomsForUser();
  }, [userDetails]); // Rerun when userDetails change
  



  useEffect(() => {
    const sockJS = new SockJS('https://projectsync-finalversion.onrender.com/ws');
    const stompClient = new Client({
      webSocketFactory: () => sockJS,
      debug: (str) => console.log(str),
    });

    stompClient.onConnect = () => {
      console.log("Connected");
      subscribeToRoom(currentRoom, stompClient);
    };

    stompClient.activate();
    setClient(stompClient);

    return () => stompClient.deactivate();
  }, []); // Note: Removed currentRoom from dependencies to prevent re-connecting on room change.

  useEffect(() => {
    if (client) {
      subscribeToRoom(currentRoom, client);
      fetchHistoricalMessages(currentRoom);
    }
  }, [currentRoom]); // Re-subscribe to the new room when currentRoom changes.

  const subscribeToRoom = (room, stompClient) => {
    // Unsubscribe from the previous room's topic if client is defined
    if (client) {
      stompClient.unsubscribe(`/topic/${currentRoom}`);
    }
  
    // Subscribe to the new room's topic
    stompClient.subscribe(`/topic/${room}`, (message) => {
      const receivedMessage = JSON.parse(message.body);
      setMessages(prevMessages => [...prevMessages, receivedMessage]);
    });
  };
  

  const fetchHistoricalMessages = async (room) => {
    try {
      const response = await axios.get(`https://projectsync-finalversion.onrender.com/users/chat/${room}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching historical messages:", error.response);

    }
  };

  const sendMessage = () => {
    if (client && newMessage.trim() !== "") {
      const chatMessage = {
        senderEmail: userDetails.screenName,
        content: newMessage,
        type: 'CHAT',
        roomId: currentRoom,
      };

      client.publish({ destination: `/app/chat/${currentRoom}/sendMessage`, body: JSON.stringify(chatMessage) });
      setNewMessage("");
    }
  };

  const handleRoomChange = (newRoom) => {
    const roomExists = rooms.includes(newRoom);

  if (!roomExists) {
    // If the room does not exist, add it to the list of rooms
    setRooms(prevRooms => [...prevRooms, newRoom]);
  }

  // Set the new room as the current room and clear messages
  setCurrentRoom(newRoom);
  setMessages([]);
  };
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roomId = queryParams.get('roomId');
    if (roomId) {
      setCurrentRoom(roomId);
      // Optionally, navigate the UI to the room's details
    }
  }, [location]); 
  return (
    <div className="container-fluid vh-100" id="content-chat">
      <div className="row h-100">
        
        <div className="col-md-4 col-lg-3 bg-light p-3 " id="navbar-chat">
           
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search a new room id..."
              onKeyDown={(e) => e.key === 'Enter' && handleRoomChange(e.target.value)}
              aria-label="New room name"
            />
          </div>
          <div className="list-group">
            {rooms.map((room, index) => (
              <button
                key={index}
                type="button"
                className={`list-group-item list-group-item-action ${currentRoom === room ? 'active' : ''}`}
                onClick={() => setCurrentRoom(room)}
              >
                {room}
              </button>
            ))}
          </div>
        </div>
        <div className="col-md-8 col-lg-9 p-6">
        <div className="col-md-8 col-lg-9 p-6" id="chatroom">
  <div className="card h-100">
    <div className="card-body" id="chat-body" style={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}>
      {messages.map((msg, index) => (
        <div key={index} className={`d-flex ${msg.senderEmail === userDetails.screenName ? 'flex-row-reverse' : ''} align-items-start mb-3`}>
          <img
            src={`https://projectsync-finalversion.onrender.com/api/user/${msg.senderEmail}/picture`}
            alt="Profile"
            className="rounded-circle"
            onError={(e) => e.target.src = 'profilePicture.png'}
            style={{ width: '65px', height: '65px', marginLeft: '10px', marginRight: '10px' }}
          />
          <div
      className="message"
      style={{
        maxWidth: '60%',
        padding: '10px',
        borderRadius: '20px',
        backgroundColor: msg.senderEmail === userDetails.screenName ? '#DCF8C6' : '#BFE9FF', // Changed color for others' messages
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        color: 'black',
        alignSelf: 'flex-start',
        textAlign: msg.senderEmail === userDetails.screenName ? 'right' : 'left',
      }}
    >
            <div className={`message-header ${msg.senderEmail === userDetails.screenName ? 'text-end' : ''}`}>
              <strong>{msg.senderEmail === userDetails.screenName ? 'You' : msg.senderEmail}</strong>
            </div>
            <div className="message-body">{msg.content} </div>
          </div>
        </div>
      ))}
      {error && <div className="alert alert-danger mt-2">{error}</div>}
    </div>
    <div className="card-footer">
      <div className="d-flex gap-2">
        <textarea
          className="form-control"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write a message..."
          rows="1"
        ></textarea>
        <button className="btn btn-primary" type="button" onClick={sendMessage}>
          <i className="bi bi-send-fill"></i>
        </button>
      </div>
    </div>
  </div>
</div>

</div>

    </div>
</div>
  );
  
};

export default Collaborators;