const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  doc_id: { type: String, required: true },
  room_id: { type: String, required: true},
  user_id:{ type: String, required: true},
  message: { type: String, required: true},
  name:    {type: String, required:true},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;
