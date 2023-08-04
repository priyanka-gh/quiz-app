import mongoose from 'mongoose';
const { Schema } = mongoose;

// Quiz Model
const quizSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  });

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;