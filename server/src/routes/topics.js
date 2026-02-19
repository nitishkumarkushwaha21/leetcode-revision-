import express from 'express';
import {
  getTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  getQuestionsByTopicName,
} from '../controllers/topicController.js';
// import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Temporarily removing authentication
// router.use(protect);

router.route('/')
  .get(getTopics)
  .post(createTopic);

router.route('/:name/questions')
    .get(getQuestionsByTopicName);

router.route('/:id')
  .put(updateTopic)
  .delete(deleteTopic);

export default router;
