import mongoose from 'mongoose';

const PointSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true
  },
  points: {
    type: Number,
    default: 0
  }
});

export const PointModel = mongoose.models.Point || mongoose.model('Point', PointSchema);