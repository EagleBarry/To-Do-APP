// server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import connectDB from '../database';
import Task from '../src/app/models/task.model';

const app = express();
const PORT = process.env['PORT'] || 3500;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

const allowedOrigins = ['http://localhost:4200', 'http://localhost:3500'];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};
app.use(cors(options));

// Routes

// Get all tasks
app.get('/tasks', async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    if (!tasks || tasks.length === 0) return res.status(404).send('No tasks found.');
    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).send('Server Error');
  }
});

// Get a single task by ID
app.get('/task/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).send('Task not found.');
    return res.status(200).json(task);
  } catch (error) {
    console.error(`Error fetching task with ID ${id}:`, error);
    return res.status(500).send('Server Error');
  }
});

// Create a new task
app.post('/task', async (req: Request, res: Response) => {
  const { name, description, completed } = req.body;
  if (!name || !description) {
    return res.status(400).send('Name and description are required.');
  }

  try {
    const newTask = new Task({
      name,
      description,
      completed: completed || false,
    });
    const savedTask = await newTask.save();
    return res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).send('Server Error');
  }
});

// Update an existing task
app.put('/task/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, completed } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { name, description, completed },
      { new: true, runValidators: true }
    );

    if (!updatedTask) return res.status(404).send('Task not found.');
    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error(`Error updating task with ID ${id}:`, error);
    return res.status(500).send('Server Error');
  }
});

// Delete a task
app.delete('/task/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) return res.status(404).send('Task not found.');
    return res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (error) {
    console.error(`Error deleting task with ID ${id}:`, error);
    return res.status(500).send('Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
