import express, { Request, Response } from 'express';
import Quiz from '../models/Quiz';
import Question from '../models/Question';
import mongoose from 'mongoose';

interface IQuiz extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  creator: mongoose.Types.ObjectId;
  questions: mongoose.Types.Array<mongoose.Types.ObjectId>;
}


// Create Question
export const createQuestion =  async (req: Request, res: Response) => {
  const { quizId } = req.params;
  const { text, options, answers } = req.body;

  try {
    const quiz = await Quiz.findOne({ _id: quizId, creator: req.userId }); // req.userId is set in the auth middleware

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const question = new Question({ text, options, answers });
    await question.save();

    quiz.questions.push(question._id);
    await quiz.save();

    res.status(201).json({ message: 'Question created successfully', question });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Get All Questions for a Specific Quiz
export const getAllQuestions = async (req: Request, res: Response) => {
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findOne({ _id: quizId, creator: req.userId }).populate('questions'); // req.userId is set in the auth middleware

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({ questions: quiz.questions });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Get Specific Question
export const getQuestionById = async (req: Request, res: Response) => {
  const { quizId, questionId } = req.params;

  try {
    const quiz = await Quiz.findOne({ _id: quizId, creator: req.userId, questions: questionId }); // req.userId is set in the auth middleware

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz or question not found' });
    }

    const question = await Question.findById(questionId);

    res.json({ question });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Update Question
export const updateQuestion = async (req: Request, res: Response) => {
  const { quizId, questionId } = req.params;

  try {
    const quiz = await Quiz.findOne({ _id: quizId, creator: req.userId, questions: questionId }); // req.userId is set in the auth middleware

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz or question not found' });
    }

    const question = await Question.findByIdAndUpdate(questionId, req.body, { new: true });

    res.json({ message: 'Question updated successfully', question });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

// Delete Question
export const deleteQuestion = async (req: Request, res: Response) => {
  const { quizId, questionId } = req.params;

  try {
    const quiz = await Quiz.findOne({ _id: quizId, creator: req.userId, questions: questionId }); // req.userId is set in the auth middleware

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz or question not found' });
    }

    const quizDoc = quiz as IQuiz;

    const question = await Question.findByIdAndDelete(questionId);

    quizDoc.questions.pull(questionId);
    await quizDoc.save();

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};