// src/models/Task.ts
import mongoose, { Document, Schema } from 'mongoose';

interface ITask extends Document {
  title: string;
  description?: string;
  dueDate: string;
  status: 'Pending' | 'Completed';
}

const taskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
});

// กำหนดชื่อ collection เป็น 'Task'
export default mongoose.models.Task || mongoose.model<ITask>('Task', taskSchema, 'Task');
