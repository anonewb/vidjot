// SCHEMA(STRUCTURE) FOR IDEA

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema (~DATA STRUCTURE IN VANILLAJS)
const IdeaSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  date: {
    type: String,
    default: Date.now
  }
});

mongoose.model('ideas', IdeaSchema);
