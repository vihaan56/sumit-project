const mongoose = require('mongoose');


const roomsSchema = new mongoose.Schema({
    room_id: { type: String, required: true },
    user_id: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
  });
  
  const Roomuser = mongoose.model('Roomuser', roomsSchema);
  module.exports = Roomuser;
