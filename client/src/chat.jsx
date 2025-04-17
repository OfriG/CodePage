import { useEffect, useState } from 'react';
import socket from './socket';
import './style.css';

export default function Chat({ codeBlockId, role, username }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on('newMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off('newMessage');
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const msgData = {
      blockId: codeBlockId,
      senderName: username,
      senderRole: role,
      message: input.trim(),
    };

    socket.emit('sendMessage', msgData);
    setInput('');
  };

  return (
    <div className="chat-container">
      <h2 className="chat-header">Live chat messages</h2>
      <div className="messages-list">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.senderRole}`}>
            <strong>{m.senderName}</strong>
            <p>{m.message}</p>
            <div className="timestamp">{new Date(m.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>

      <div className="input-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
