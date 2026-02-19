import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Question title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Question description is required'],
  },
  url: {
    type: String,
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  // Topic can be either a reference or an object with name
  topic: {
    type: mongoose.Schema.Types.Mixed, // Can be ObjectId or object
    required: true,
  },
  // LeetCode slug for imported questions
  leetCodeSlug: {
    type: String,
    trim: true,
  },
  // Notes for the question
  notes: {
    type: String,
    default: '',
  },
  // Reference to the user who owns this question
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  // Array of solution IDs associated with this question
  solutions: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Solution'
  }]
}, { timestamps: true });

const Question = mongoose.model('Question', QuestionSchema);
export default Question;
