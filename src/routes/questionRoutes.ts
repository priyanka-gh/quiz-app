import express from 'express';
import { createQuestion, getAllQuestions, getQuestionById, deleteQuestion, updateQuestion} from '../controllers/QuestionController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.post('/:quizId', authMiddleware, createQuestion);
router.get('/:quizId', authMiddleware, getAllQuestions);
router.get('/:quizId/:questionId', authMiddleware, getQuestionById);
router.put('/:quizId/:questionId', authMiddleware, updateQuestion);
router.delete('/:quizId/:questionId', authMiddleware, deleteQuestion);

export default router;
