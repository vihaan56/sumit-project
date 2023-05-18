const mongoose = require('mongoose');


const roomsSchema = new mongoose.Schema({
    room_name: { type: String, unique: true,required: true},
    user: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    room_title: { type: String, maxlength: 100,required: true},
  });
  
  const Rooms = mongoose.model('Rooms', roomsSchema);
  module.exports = Rooms;
