import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

// MongoDB URI kết nối
const mongoUri = "mongodb+srv://hvhhhta1:mPYTbvj5cOolUUWf@hiep.lezxu.mongodb.net/?retryWrites=true&w=majority";

const TaskSchema = new mongoose.Schema({
  address: String,
  points: Number,
});

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);

// Kết nối MongoDB
async function connectToDb() {
    try {
      if (mongoose.connections[0].readyState) return;
      console.log('Connecting to MongoDB...');
      await mongoose.connect(mongoUri);
      console.log('Successfully connected to MongoDB!');
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw new Error("Failed to connect to MongoDB");
    }
  }
  

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query; // Lấy địa chỉ ví từ query

  if (req.method === "GET") {
    try {
      await connectToDb();
      const task = await Task.findOne({ address: address as string });
      
      if (task) {
        return res.status(200).json({ points: task.points });
      }
      // Nếu chưa có điểm, tạo task mới
      const newTask = new Task({ address, points: 0 });
      await newTask.save();
      return res.status(200).json({ points: newTask.points });
    } catch (error) {
      console.error("Error fetching task:", error);
      res.status(500).json({ error: "Failed to fetch task." });
    }
  }

  if (req.method === "POST") {
    const { address, taskId } = req.body;

    try {
      await connectToDb();
      const task = await Task.findOne({ address: address });

      if (task) {
        task.points += 10; // Giả sử nhiệm vụ kiếm được 10 điểm
        await task.save();
        return res.status(200).json({ points: task.points });
      } 
        return res.status(404).json({ error: "Task not found" });
      
    } catch (error) {
      console.error("Error performing task:", error);
      res.status(500).json({ error: "Failed to perform task." });
    }
  }
}