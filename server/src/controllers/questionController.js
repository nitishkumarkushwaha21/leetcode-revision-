import Question from '../models/Question.js';
import Solution from '../models/Solution.js';
import Topic from '../models/Topic.js';

// @desc    Get questions, optionally filtered by topic
// @route   GET /api/questions?topicId=...
// @access  Private
export const getQuestions = async (req, res) => {
  try {
    const filter = { user: req.user.id };
    if (req.query.topicId) {
      filter.topic = req.query.topicId;
    }
    const questions = await Question.find(filter).sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new question
// @route   POST /api/questions
// @access  Private (temporarily public)
export const createQuestion = async (req, res) => {
  const { title, description, difficulty, tags, topic, leetCodeSlug, solutions, notes } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  try {
    // For now, skip topic validation since we're not using authentication
    // const topicExists = await Topic.findById(topic);
    // if (!topicExists || topicExists.user.toString() !== req.user.id) {
    //     return res.status(404).json({ message: 'Topic not found or not authorized' });
    // }

    const question = new Question({
      title,
      description,
      difficulty: difficulty || 'Medium',
      tags: tags || [],
      topic: topic || { name: 'Dynamic Programming' },
      leetCodeSlug,
      notes,
      solutions: solutions || [],
      user: req.user?.id || 'temp-user', // Temporary user ID
    });

    const createdQuestion = await question.save();
    res.status(201).json(createdQuestion);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get a single question by ID with its solutions
// @route   GET /api/questions/:id
// @access  Private
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('solutions');
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Add a solution to a question
// @route   POST /api/questions/:id/solutions
// @access  Private
export const addSolutionToQuestion = async (req, res) => {
    const { logic, code, language, timeComplexity, spaceComplexity, notes } = req.body;
    const { id: questionId } = req.params;

    try {
        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        if (question.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const solution = new Solution({
            logic, code, language, timeComplexity, spaceComplexity, notes,
            question: questionId,
            user: req.user.id,
        });

        const createdSolution = await solution.save();

        // Add the solution's ID to the question's solutions array
        question.solutions.push(createdSolution._id);
        await question.save();

        res.status(201).json(createdSolution);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private
export const deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        if (question.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Also delete all associated solutions
        await Solution.deleteMany({ question: req.params.id });
        await question.deleteOne();

        res.json({ message: 'Question and associated solutions removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
