import mongoose from "mongoose";

const answerKeySchema = new mongoose.Schema({
  examId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  examName: {
    type: String,
    required: true,
    trim: true
  },
  answers: {
    type: Map,
    of: String,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model("AnswerKey", answerKeySchema);
