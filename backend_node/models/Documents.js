

const mongoose = require('mongoose');

// Create a schema for the Document model
const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: Object},
  uid:{type:String, required: true,unique:true},
  user_id:{type: String, required: true},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Create the Document model
const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
