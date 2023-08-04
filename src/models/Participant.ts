import mongoose from 'mongoose';
const { Schema } = mongoose;

// Participant Model
const participantSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    answers: [{ question: { type: Schema.Types.ObjectId, ref: 'Question' }, answer: String }],
    score: { type: Number, default: 0 },
  });
  
  const Participant = mongoose.model('Participant', participantSchema);
  
export default Participant;