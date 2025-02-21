import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

// MongoDB URI
const mongoUri = "mongodb+srv://hvhhhta1:mPYTbvj5cOolUUWf@hiep.lezxu.mongodb.net/?retryWrites=true&w=majority&appName=Hiep";

// Task Schema
const TaskSchema = new mongoose.Schema({
  address: String,
  points: Number,
});

// Task Model
const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);

// Connect to MongoDB
async function connectToDb() {
  try {
    if (mongoose.connections[0].readyState) return;
    await mongoose.connect(mongoUri);
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      await connectToDb();
      const leaderboard = await Task.find({}).sort({ points: -1 }).limit(10); // Top 10 users by points

      res.status(200).json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard." });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
