const mongoose = require('mongoose');

const VerificationQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true } // plain text answer
});

const LostItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    photos: [{ type: String }],
    contactName: { type: String, required: true },
    contactPhone: { type: String, required: true },
    contactEmail: { type: String },
    status: {
      type: String,
      enum: ['lost', 'found', 'claimed'],
      default: 'lost'
    },
    questions: [VerificationQuestionSchema],
    postedBy: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('LostItem', LostItemSchema);
