import mongoose from 'mongoose';

const SolutionSchema = new mongoose.Schema({
  logic: {
    type: String,
    required: [true, 'Solution logic is required'],
    trim: true,
  },
  code: {
    type: String,
    required: [true, 'Code snippet is required'],
  },
  language: {
    type: String,
    default: 'javascript',
    trim: true,
  },
  timeComplexity: {
    type: String,
    default: 'O(n)',
    trim: true,
  },
  spaceComplexity: {
    type: String,
    default: 'O(1)',
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  // Reference to the question this solution belongs to
  question: {
    type: mongoose.Schema.ObjectId,
    ref: 'Question',
    required: true,
  },
  // Reference to the user who owns this solution
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

const Solution = mongoose.model('Solution', SolutionSchema);
export default Solution;
