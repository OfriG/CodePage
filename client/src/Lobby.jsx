import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {API} from '../config'
import './style.css';

export default function Lobby({ userId}) {
  const [blocks, setBlocks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(API +'api/codeBlock')
      .then(res => res.json())
      .then(setBlocks)
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="lobby-container">
     <p className="titleBODY">Choose code block</p>
     <br/>
      <div className="grid">
      {blocks.map((block, index) => (
  <div
    className={`card-style card-${index % 5}`}
    key={block._id}
    onClick={() => navigate(`/code/${block._id}`)}
  >
    <div className="card-content">
      <p className="title">{block.title}</p>
      <button className="view-btn">VIEW MORE</button>
    </div>
  </div>
))}

    </div>
    </div>

  );
}
