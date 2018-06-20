// SCHEMA(STRUCTURE) FOR User

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema (~DATA STRUCTURE IN VANILLAJS)
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: String,
    default: Date.now
  }
});

mongoose.model('users', UserSchema);
