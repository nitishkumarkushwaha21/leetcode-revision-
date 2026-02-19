import Topic from '../models/Topic.js';
import Question from '../models/Question.js';
import Solution from '../models/Solution.js';

// @desc    Get all topics for the logged-in user (or all topics if no auth)
// @route   GET /api/topics
// @access  Private (temporarily public)
export const getTopics = async (req, res) => {
  try {
    // If user is authenticated, get their topics, otherwise get all topics
    const filter = req.user ? { user: req.user.id } : {};
    const topics = await Topic.find(filter).sort({ name: 1 });
    res.json(topics);
  } catch (error) {
    console.error('Error in getTopics:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new topic
// @route   POST /api/topics
// @access  Private (temporarily public)
export const createTopic = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Topic name is required' });
  }

  try {
    const topic = new Topic({
      name,
      description: description || '',
      user: req.user?.id || 'temp-user', // Use temp user if no auth
    });

    const createdTopic = await topic.save();
    res.status(201).json(createdTopic);
  } catch (error) {
    if (error.code === 11000) {
        return res.status(400).json({ message: `Topic with name "${name}" already exists.` });
    }
    console.error('Error in createTopic:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get questions for a specific topic by its name
// @route   GET /api/topics/:name/questions
// @access  Private (temporarily public)
export const getQuestionsByTopicName = async (req, res) => {
    try {
        const topicNameFromUrl = req.params.name.replace(/-/g, ' ');

        // If user is authenticated, filter by user, otherwise get all
        const userFilter = req.user ? { user: req.user.id } : {};
        
        const topic = await Topic.findOne({ 
            name: { $regex: new RegExp(`^${topicNameFromUrl}$`, 'i') },
            ...userFilter
        });

        if (!topic) {
            console.warn(`Topic not found for name: "${topicNameFromUrl}"`);
            return res.status(404).json({ message: 'Topic not found' });
        }

        const questions = await Question.find({ topic: topic._id, ...userFilter }).sort({ createdAt: -1 });

        res.json({ topic, questions });
    } catch (error) {
        console.error('Error in getQuestionsByTopicName:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Update a topic
// @route   PUT /api/topics/:id
// @access  Private (temporarily public)
export const updateTopic = async (req, res) => {
  const { name, description } = req.body;

  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    // Skip user authorization check if no auth
    if (req.user && topic.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    topic.name = name || topic.name;
    topic.description = description || topic.description;

    const updatedTopic = await topic.save();
    res.json(updatedTopic);
  } catch (error) {
    console.error('Error in updateTopic:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a topic
// @route   DELETE /api/topics/:id
// @access  Private (temporarily public)
export const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    // Skip user authorization check if no auth
    if (req.user && topic.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const questionsToDelete = await Question.find({ topic: topic._id });
    const questionIds = questionsToDelete.map(q => q._id);

    if (questionIds.length > 0) {
        await Solution.deleteMany({ question: { $in: questionIds } });
    }
    
    await Question.deleteMany({ topic: topic._id });
    
    await topic.deleteOne();

    res.json({ message: 'Topic and all associated data removed' });
  } catch (error) {
    console.error('Error in deleteTopic:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
