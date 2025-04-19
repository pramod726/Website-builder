const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    preferences: {
      theme: { type: String, default: 'light' },
      frameworks: [{ type: String }]
    },
    projects: [{ type: Schema.Types.ObjectId, ref: 'project' }],
    
    // ✅ NEW FIELD for multi-session token tracking
    tokenList: [{ type: String }]
  }, {
    timestamps: true
  });
  