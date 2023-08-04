import express from 'express';
import { participate, getAllResultsForCreator, getMyResults, submitAnswers } from '../controllers/ParticipantController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.post('/:quizId/participate', authMiddleware, participate);
router.post('/:quizId/submit', authMiddleware, submitAnswers);
router.get('/:quizId/myresults', authMiddleware, getMyResults);
router.get('/:quizId/results', authMiddleware, getAllResultsForCreator);

export default router;
