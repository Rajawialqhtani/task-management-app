'use client'; // Mark this as a Client Component

import { useEffect, useState } from 'react';
import axios from 'axios';

// Define the Task type
type Task = {
  id: number;
  title: string;
  status: string;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]); // State to store tasks
  const [newTask, setNewTask] = useState({ title: '', status: '' }); // State for the new task form

  // Fetch tasks from the backend
  useEffect(() => {
    axios.get<Task[]>('https://your-backend-url.com/tasks')
      .then((response) => setTasks(response.data))
      .catch((error) => console.error('Error fetching tasks:', error));
  }, []);

  // Handle form submission to create a new task
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<Task>('https://your-backend-url.com/tasks', newTask);
      setTasks([...tasks, response.data]); // Add the new task to the list
      setNewTask({ title: '', status: '' }); // Clear the form
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // Handle task deletion
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://your-backend-url.com/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id)); // Remove the task from the list
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Task Management App</h1>

      {/* Form to add a new task */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          style={{ padding: '8px', marginRight: '10px', width: '200px' }}
        />
        <input
          type="text"
          placeholder="Status"
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          style={{ padding: '8px', marginRight: '10px', width: '200px' }}
        />
        <button
          type="submit"
          style={{ padding: '8px 16px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px' }}
        >
          Add Task
        </button>
      </form>

      {/* List of tasks */}
      <ul style={{ listStyleType: 'none', padding: '0' }}>
        {tasks.map((task) => (
          <li key={task.id} style={{ padding: '10px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{task.title} - {task.status}</span>
            <button
              onClick={() => handleDelete(task.id)}
              style={{ padding: '5px 10px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '4px' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
