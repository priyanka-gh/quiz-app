import express, { Request, Response } from 'express';
import Quiz from '../models/Quiz';
import Question from '../models/Question';
import Participant from '../models/Participant';
import mongoose from 'mongoose';

interface IQuestion {
  _id: mongoose.Types.ObjectId;
  question: string;
  options: string[];
  answers: string[];
  quiz: mongoose.Types.ObjectId;
}

interface IQuiz {
  _id: mongoose.Types.ObjectId;
  name: string;
  creator: mongoose.Types.ObjectId;
  questions: mongoose.Types.ObjectId[] | IQuestion[];
}

// Participate in a Quiz
export const participate = async (req: Request, res: Response) => {
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findById(quizId).populate('questions');

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const participant = new Participant({ user: req.userId, quiz: quizId }); // req.userId is set in the auth middleware
    await participant.save();

    res.json({ message: 'Participation successful', questions: quiz.questions });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Submit Answers
export const submitAnswers = async (req: Request, res: Response) => {
  const { quizId } = req.params;
  const { answers } = req.body; // answers should be an array of { questionId, answer }

  try {
    const participant = await Participant.findOne({ quiz: quizId, user: req.userId }); // req.userId is set in the auth middleware

    if (!participant) {
      return res.status(404).json({ error: 'Participation not found' });
    }

    participant.answers = answers;

    // Calculate score
    const quiz = await Quiz.findById(quizId).populate('questions');

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const quizDoc = quiz as unknown as IQuiz;
    const questions = quizDoc.questions as IQuestion[];

    participant.score = questions.reduce((score, question) => {
      const answerObj = answers.find((answer: { questionId: string, answer: string }) => answer.questionId === question._id.toString());
      if (!answerObj) return score; // Skip if no answer is found for the current question.
      const answer = answerObj.answer;
      return score + (question.answers.map(a => a.toString()).includes(answer) ? 1 : 0);
    }, 0);

    await participant.save();

    res.json({ message: 'Answers submitted successfully', participant });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Get My Results
export const getMyResults = async (req: Request, res: Response) => {
  const { quizId } = req.params;

  try {
    const participant = await Participant.findOne({ quiz: quizId, user: req.userId }).populate('quiz'); // req.userId is set in the auth middleware

    if (!participant) {
      return res.status(404).json({ error: 'Participation not found' });
    }

    res.json({ participant });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Get All Results (Quiz Creator Only)
export const getAllResultsForCreator = async (req: Request, res: Response) => {
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findOne({ _id: quizId, creator: req.userId }); // req.userId is set in the auth middleware

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const participants = await Participant.find({ quiz: quizId }).populate('user');

    res.json({ participants });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};
