const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  id: Number,  
  task: String,
  completed: { type: Boolean, default: false }
}, { versionKey: false });

module.exports = mongoose.model('Todo', todoSchema);
