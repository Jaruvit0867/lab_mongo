// src/components/Tasks.tsx
"use client";

import React, { useState, useEffect } from 'react';
import './TaskStyles.css';

interface Task {
  _id?: string;
  title: string;
  description?: string;
  status: 'Completed' | 'Pending';
  dueDate: string; // ต้องมี dueDate เป็นส่วนหนึ่งของ interface
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch tasks on component mount
  useEffect(() => {
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => {
        setTasks(data.data); // ตรวจสอบให้แน่ใจว่า API ส่ง dueDate มาด้วย
        setLoading(false);
      });
  }, []);

  // Function to add a new task
  const addTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !dueDate) return;

    const newTask: Task = { title, description, status: 'Pending', dueDate };
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    });

    const addedTask = await response.json();
    setTasks([...tasks, addedTask.data]); // เพิ่ม task ใหม่ใน state
    setTitle('');
    setDescription('');
    setDueDate('');
  };

  // Function to update task status
  const toggleStatus = async (id: string) => {
    const task = tasks.find((task) => task._id === id);
    if (!task) return;

    const updatedTask = {
      ...task,
      status: task.status === 'Pending' ? 'Completed' : 'Pending',
    };

    await fetch(`/api/tasks?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: updatedTask.status }),
    });

    setTasks(tasks.map((t) => (t._id === id ? updatedTask : t)));
  };

  // Function to delete a task
  const deleteTask = async (id: string) => {
    await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
    setTasks(tasks.filter((task) => task._id !== id));
  };

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div className="task-container">
      <h1>Task Management</h1>
      <form onSubmit={addTask} className="task-form">
        <input
          className="task-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
          required
        />
        <textarea
          className="task-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task Description"
        />
        <input
          className="task-input"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <button type="submit" className="task-button">Add Task</button>
      </form>
      <div className="task-list">
        {tasks.map((task) => (
          <div
            key={task._id}
            className={`task-item ${task.status === 'Completed' ? 'completed' : ''}`}
          >
            <div>
              <h2 className="task-title">{task.title}</h2>
              <p>{task.description}</p>
              <p>Due: {task.dueDate}</p> {/* แสดง dueDate */}
              <p>Status: {task.status}</p>
            </div>
            <div>
              <button onClick={() => toggleStatus(task._id!)} className="task-button">
                {task.status === 'Pending' ? 'Mark as Completed' : 'Mark as Pending'}
              </button>
              <button onClick={() => deleteTask(task._id!)} className="task-button delete">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
