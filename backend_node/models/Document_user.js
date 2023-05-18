const mongoose = require('mongoose');

const docsUserSchema = new mongoose.Schema({
  document: { type: String, required: true },
  user: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const DocsUser = mongoose.model('DocsUser', docsUserSchema);
module.exports = DocsUser;
