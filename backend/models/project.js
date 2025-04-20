const mongoose = require('mongoose');
const { Schema } = mongoose;

// Chat interaction to preserve AI conversation context
const InteractionSchema = new Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

// Simple file snapshot representing current UI code state
const FileSchema = new Schema({
  filename: { type: String, required: true }, 
  filepath: { type: String, required: true }, 
  code: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
}, { _id: false });

const ProjectSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  title: { type: String, default: 'Untitled UI Project' },
  status: { type: String, enum: ['active', 'completed', 'error'], default: 'active' },
  // preserve the sequence of user prompts and AI responses for context
  interactions: [InteractionSchema],
  // current UI code files for live preview
  files: [FileSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('project', ProjectSchema);