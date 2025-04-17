const Message = require('../models/message');  

// Handle sending a new message
exports.sendMessage = async (req, res) => {
  try {
    const { blockId, senderName, senderRole, message } = req.body;

    // create message
    const newMessage = new Message({
      blockId,
      senderName,
      senderRole,
      message
    });

   
    await newMessage.save();

    res.status(200).json(newMessage); 

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
};

// Get all messages for a specific block
exports.getMessages = async (req, res) => {
  try {
    const { blockId } = req.params;

    const messages = await Message.find({ blockId }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ message: 'Error retrieving messages' });
  }
};
