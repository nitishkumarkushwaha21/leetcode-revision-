import express from 'express';
import {
  getQuestions,
  createQuestion,
  getQuestionById,
  addSolutionToQuestion,
  deleteQuestion,
} from '../controllers/questionController.js';
// import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Temporarily removing authentication
// router.use(protect);

router.route('/')
  .get(getQuestions)
  .post(createQuestion);

router.route('/:id')
  .get(getQuestionById)
  .delete(deleteQuestion);

router.route('/:id/solutions')
    .post(addSolutionToQuestion);

export default router;
