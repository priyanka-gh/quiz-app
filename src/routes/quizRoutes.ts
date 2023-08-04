import express from 'express';
import { createQuiz, deleteQuiz, getAllQuizzes, getQuizById, updateQuiz } from '../controllers/QuizController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware, createQuiz);
router.get('/', authMiddleware, getAllQuizzes);
router.get('/:quizId', authMiddleware, getQuizById);
router.put('/:quizId', authMiddleware, updateQuiz);
router.delete('/:quizId', authMiddleware, deleteQuiz);

export default router;
