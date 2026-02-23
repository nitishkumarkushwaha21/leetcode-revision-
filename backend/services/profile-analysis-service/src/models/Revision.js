const mongoose = require('mongoose');

const RevisionSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    problemName: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    leetcodeUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Prevent duplicate problem for same user
RevisionSchema.index({ username: 1, problemName: 1 }, { unique: true });

module.exports = mongoose.model('Revision', RevisionSchema);
