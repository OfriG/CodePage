const rooms = {};       
const currentCode = {};   
const questions = {};     
const Message = require('./models/message'); 

module.exports = function(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", ({ blockId }) => {
      console.log("joinRoom received with blockId:", blockId);

      if (!rooms[blockId]) {
        rooms[blockId] = [];
        currentCode[blockId] = '';
        questions[blockId] = []; 
        console.log("Created new room:", blockId);
      }
      // Avoid duplicate socket entries
      if (!rooms[blockId].includes(socket.id)) {
        rooms[blockId].push(socket.id);
        console.log(`Socket ${socket.id} added to room ${blockId}`);
      }

      const role = rooms[blockId].length === 1 ? 'mentor' : 'student';

      socket.data = {
        role,
        blockId
      };
      socket.join(blockId);

      // Notify the client of their role
      socket.emit('role', role);
      console.log(`User ${socket.id} joined room ${blockId} as ${role}`);

      socket.emit('codeUpdate', currentCode[blockId]);
      const studentCount = rooms[blockId].length - 1;
      io.to(blockId).emit('studentCount', studentCount);

      socket.emit('allQuestions', questions[blockId]);

      socket.on('codeUpdate', (newCode) => {
        const { blockId } = socket.data;
        if (blockId) {
          currentCode[blockId] = newCode;
          socket.to(blockId).emit('codeUpdate', newCode); // send to all except sender
          console.log(`Code updated in room ${blockId}:`, newCode);
        }
      });

      // Handle user leave room
      socket.on('leaveRoom', () => {
        const { blockId, role } = socket.data;
        if (!rooms[blockId]) return;

        rooms[blockId] = rooms[blockId].filter(id => id !== socket.id);
        console.log(`${socket.id} left room ${blockId}`);

        if (role === 'mentor') {
          io.to(blockId).emit('mentorLeft');
          delete rooms[blockId];
          delete currentCode[blockId];
          delete questions[blockId]; 
          console.log(`Mentor (${socket.id}) left. Room ${blockId} closed.`);
          return;
        }

        const updatedCount = rooms[blockId].length - 1;
        io.to(blockId).emit('studentCount', updatedCount);
        console.log(`Updated student count in ${blockId}: ${updatedCount}`);
        
        if (rooms[blockId].length === 0) {
          delete rooms[blockId];
          delete currentCode[blockId];
          delete questions[blockId]; 
          console.log(`Room ${blockId} is empty. Deleted.`);
        }
      });

      // Handle user disconnection
      socket.on('disconnect', () => {
        const { blockId, role } = socket.data;
        if (!rooms[blockId]) return;

        console.log(`${socket.id} disconnected from ${blockId} (${role})`);

        rooms[blockId] = rooms[blockId].filter(id => id !== socket.id);

        // If the mentor left, close the room and notify others
        if (role === 'mentor') {
          io.to(blockId).emit('mentorLeft');
          delete rooms[blockId];
          delete currentCode[blockId];
          delete questions[blockId]; // Delete questions when mentor leaves
          console.log(`Mentor (${socket.id}) left. Room ${blockId} closed.`);
          return;
        }

        if (rooms[blockId].length === 0) {
          delete rooms[blockId];
          delete currentCode[blockId];
          delete questions[blockId]; 
          console.log(`Room ${blockId} is empty. Deleted.`);
        } else {
          const updatedCount = rooms[blockId].length - 1;
          io.to(blockId).emit('studentCount', updatedCount);
          console.log(`Updated student count in ${blockId}: ${updatedCount}`);
        }
      });

    });
    socket.on('sendMessage', ({ blockId, senderName, senderRole, message }) => {
      const newMessage = {
        senderName,
        senderRole,
        message,
        timestamp: new Date()
      };

      const messageToSave = new Message({
        blockId,
        senderName,
        senderRole,
        message
      });

      messageToSave.save()
        .then(() => {
          io.to(blockId).emit('newMessage', newMessage);
          console.log(`New message added to block ${blockId}:`, newMessage);
        })
        .catch((err) => {
          console.error("Error saving message:", err);
        });
    });

  });
};
