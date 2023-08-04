import express, { Request, Response } from 'express';
import Quiz from '../models/Quiz';

const QuizController = express.Router();

// Create Quiz
export const createQuiz = async (req: Request, res: Response) => {
  const { title, description } = req.body;

  try {
    const quiz = new Quiz({ title, description, creator: req.userId }); // req.userId is set in the auth middleware
    await quiz.save();

    res.status(201).json({ message: 'Quiz created successfully', quiz });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Get All Quizzes for the Logged in User
export const getAllQuizzes = async (req: Request, res: Response) => {
  try {
    const quizzes = await Quiz.find({ creator: req.userId }); // req.userId is set in the auth middleware

    res.json({ quizzes });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Get Specific Quiz
export const getQuizById = async (req: Request, res: Response) => {
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findOne({ _id: quizId, creator: req.userId }); // req.userId is set in the auth middleware

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({ quiz });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Update Quiz
export const updateQuiz = async (req: Request, res: Response) => {
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findOneAndUpdate({ _id: quizId, creator: req.userId }, req.body, { new: true }); // req.userId is set in the auth middleware

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({ message: 'Quiz updated successfully', quiz });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Delete Quiz
export const deleteQuiz = async (req: Request, res: Response) => {
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findOneAndDelete({ _id: quizId, creator: req.userId }); // req.userId is set in the auth middleware

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};
