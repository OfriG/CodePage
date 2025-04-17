import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lobby from './Lobby';
import CodeBlockPage from './CodeBlockPage';

function App() {
  const [userId, setUserId] = useState(null);  // State to store the user ID
  const [username, setUsername] = useState('');  // State to store the username

  // Set userId and username on initial load or from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username') || 'Guest'; 
    setUserId(storedUserId);
    setUsername(storedUsername);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby userId={userId} username={username} />} />
        <Route path="/code/:id" element={<CodeBlockPage userId={userId} username={username} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
