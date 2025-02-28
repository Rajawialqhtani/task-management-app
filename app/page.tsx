'use client'; // Mark this as a Client Component

import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Define the Task type
type Task = {
  id: string;
  title: string;
  status: string;
  description?: string; // Optional description field
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]); // State to store tasks
  const [newTask, setNewTask] = useState({ title: '', status: 'To Do', description: '' }); // State for the new task form
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // State for selected task details

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
      const response = await axios.post<Task>('https://your-backend-url.com/tasks', {
        ...newTask,
        id: Date.now().toString(), // Generate a unique ID
      });
      setTasks([...tasks, response.data]); // Add the new task to the list
      setNewTask({ title: '', status: 'To Do', description: '' }); // Clear the form
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // Handle task deletion
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`https://your-backend-url.com/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id)); // Remove the task from the list
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Handle drag-and-drop
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const updatedTasks = Array.from(tasks);
    const [reorderedTask] = updatedTasks.splice(result.source.index, 1);
    updatedTasks.splice(result.destination.index, 0, reorderedTask);

    setTasks(updatedTasks);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Show task details modal
  const showTaskDetails = (task: Task) => {
    setSelectedTask(task);
  };

  // Close task details modal
  const closeTaskDetails = () => {
    setSelectedTask(null);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold">Task Management App</h1>
          <p className="mt-2">Organize your tasks efficiently</p>
          <button
            onClick={toggleDarkMode}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Toggle Dark Mode
          </button>
        </header>

        {/* Add Task Form */}
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Task
            </button>
          </div>
        </form>

        {/* Task List */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-6 bg-white rounded-lg shadow-md cursor-pointer transform-style-preserve-3d"
                          onClick={() => showTaskDetails(task)}
                        >
                          <h2 className="text-xl font-semibold">{task.title}</h2>
                          <p className="text-gray-600 mt-2">{task.status}</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent modal from opening
                              handleDelete(task.id);
                            }}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </motion.div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-lg shadow-md max-w-md w-full"
          >
            <h2 className="text-2xl font-bold mb-4">{selectedTask.title}</h2>
            <p className="text-gray-600 mb-4">{selectedTask.description || 'No description provided.'}</p>
            <button
              onClick={closeTaskDetails}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
