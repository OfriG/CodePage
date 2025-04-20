import { useEffect, useState } from 'react';
import socket from './socket';
import { useParams, useNavigate } from 'react-router-dom';
import './style.css'; 
import CodeBlockHeader from './components/CodeBlockHeader';
import CodeEditor from './components/CodeEditor';
import QuestionsAndCommentsSection from './components/QuestionsAndCommentsSection';
import Chat from './chat'; 
import {API} from '../config'

export default function CodeBlockPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blockData, setBlockData] = useState(null);
  const [code, setCode] = useState('');
  const [role, setRole] = useState(null);
  const [studentCount, setStudentCount] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [message, setMessage] = useState(''); 

  useEffect(() => {
    socket.emit('leaveRoom');
    socket.emit('joinRoom', { blockId: id });

    socket.on('role', (r) => {
      setRole(r);
    });

    socket.on('studentCount', (count) => {
      setStudentCount(count);
    });

    socket.on('codeUpdate', (newCode) => {
      setCode(newCode);
    });

    socket.on('mentorLeft', () => {
      alert('The mentor left. Returning to the lobby.');
      navigate('/');
    });

    fetch(API+`/api/codeBlock/${id}`)
      .then(res => res.json())
      .then(data => setBlockData(data));

    return () => {
      socket.emit('leaveRoom');
      socket.off('role');
      socket.off('studentCount');
      socket.off('codeUpdate');
      socket.off('mentorLeft');
    };
  }, [id, navigate]);
  const handleCodeChange = (value) => {
    const userCode = value.trim().replace(/\s+/g, ' ');
    const correctSolution = blockData?.solution?.trim().replace(/\s+/g, ' ');
  
    setCode(value);
    socket.emit('codeUpdate', value);
  
    // Debug: print current solution and entered code
    console.log('Entered code:', userCode);
    console.log('Correct solution:', correctSolution);
  
    // Check if the student's code matches the correct solution (ignoring excess spaces)
    if (correctSolution === userCode) {
      setIsSolved(true);
      setMessage('😊 Good job! You solved the problem!'); // Show smiley for all
    } else {
      setIsSolved(false);
      setMessage(''); // Clear message if the answer is incorrect
    }
  };
  

  const handleShowSolution = () => {
    if (blockData) setCode(blockData.solution);
  };

  const handleReset = () => {
    setCode('');
    socket.emit('codeUpdate', '');
  };

  if (!blockData) return <div>Loading...</div>;

  return (
    <div className="code-block-container">
      <button className="view-btn" onClick={() => navigate('/')}>
        Return to lobby
      </button>
      {role && (
  <div className="user-role">
    {role === 'mentor' ? 'You are the mentor' : 'You are a student'}
  </div>
)}
      <CodeBlockHeader 
        title={blockData.title} 
        description={blockData.description} 
        studentCount={studentCount} 
      />

      {isSolved && <div className="smiley">😊 Good job!</div>}

      <CodeEditor 
        code={code} 
        onCodeChange={handleCodeChange} 
        onShowSolution={handleShowSolution} 
        onReset={handleReset} 
        role={role} 
      />

      <Chat codeBlockId={id} username={blockData?.username} role={role} />
    </div>
  );
}
