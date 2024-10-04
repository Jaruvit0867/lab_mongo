// src/pages/api/tasks.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongodb';
import Task from '../../models/Task';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      // Retrieve all tasks
      try {
        const tasks = await Task.find({});
        res.status(200).json({ success: true, data: tasks });
      } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
      }
      break;

    case 'POST':
      // Create a new task
      try {
        const { title, description, dueDate, status = 'Pending' } = req.body;

        // Log received data for debugging
        console.log('Received data:', { title, description, dueDate, status });

        // Validate required fields
        if (!title || !dueDate) {
          return res.status(400).json({ success: false, error: 'Title and dueDate are required' });
        }

        const task = new Task({ title, description, dueDate, status });
        await task.save();

        console.log('Task saved:', task);  // Debugging log
        res.status(201).json({ success: true, data: task });
      } catch (error) {
        console.error('Error creating task:', error);
        res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
      }
      break;

    case 'PUT':
      // Update an existing task
      try {
        const task = await Task.findByIdAndUpdate(req.query.id, req.body, { new: true, runValidators: true });
        if (!task) {
          return res.status(404).json({ success: false, error: 'Task not found' });
        }
        res.status(200).json({ success: true, data: task });
      } catch (error) {
        console.error('Error updating task:', error);
        res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
      }
      break;

    case 'DELETE':
      // Delete a task
      try {
        const deletedTask = await Task.deleteOne({ _id: req.query.id });
        if (deletedTask.deletedCount === 0) {
          return res.status(404).json({ success: false, error: 'Task not found' });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        console.error('Error deleting task:', error);
        res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
