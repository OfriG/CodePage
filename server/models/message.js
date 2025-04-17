const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderRole: { type: String, enum: ['mentor', 'student'] },  
  message: String,              
  timestamp: { type: Date, default: Date.now }, 
  blockId: String,             
});

module.exports = mongoose.model('Message', messageSchema, 'messages');
