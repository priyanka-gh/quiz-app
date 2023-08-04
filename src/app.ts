import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDb from './utils/db';
import userRoutes from './routes/userRoutes';
import quizRoutes from './routes/quizRoutes';
import questionRoutes from './routes/questionRoutes';
import participantRoutes from './routes/participantRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDb();

app.use('/users', userRoutes);
app.use('/quizzes', quizRoutes);
app.use('/questions', questionRoutes);
app.use('/participants', participantRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
