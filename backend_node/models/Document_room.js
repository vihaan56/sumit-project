const mongoose = require('mongoose');

const docsroomSchema = new mongoose.Schema({
  document_id: { type: String, required: true,unique: true },
  room_id: { type: String, required: true,unique: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const DocsRoom = mongoose.model('DocsRoom', docsroomSchema);
module.exports = DocsRoom;

