import mongoose from 'mongoose';
const { Schema } = mongoose;

const questionSchema = new Schema({
    text: { type: String, required: true },
    options: [{ type: String, required: true }],
    answers: [{ type: String, required: true }],
  });
  
const Question = mongoose.model('Question', questionSchema);

export default Question;