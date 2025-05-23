const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    preferences: {
      theme: { type: String, default: 'light' },
      frameworks: [{ type: String }]
    },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'project' }],
    
    // ✅ NEW FIELD for multi-session token tracking
    tokenList: [{ type: String }]
  }, {
    timestamps: true
  });

  module.exports = mongoose.model("user", UserSchema);
  