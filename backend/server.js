const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors()); // Allow all cross-origin requests for this take-home task
app.use(express.json());

const server = http.createServer(app);

// Initialize Socket.IO with permissive CORS settings
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

/**
 * In-memory data store for tasks
 * In a real production app, this would be a MongoDB or PostgreSQL database.
 * 
 * Task schema:
 * {
 *   id: string,
 *   title: string,
 *   description: string,
 *   status: 'To Do' | 'In Progress' | 'Done',
 *   priority: 'Low' | 'Medium' | 'High',
 *   category: 'Bug' | 'Feature' | 'Enhancement',
 *   attachmentUrl: string | null,
 *   createdAt: number
 * }
 */
let tasks = [];

// Sample initial data (optional, but helpful for initial UI render)
tasks.push({
  id: uuidv4(),
  title: 'Setup Backend',
  description: 'Initialize Node.js + Express + Socket.IO server',
  status: 'Done',
  priority: 'High',
  category: 'Feature',
  attachmentUrl: null,
  createdAt: Date.now() - 100000
});

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', taskCount: tasks.length });
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Immediately send the current state of tasks to the newly connected client
  socket.emit('sync:tasks', tasks);

  /**
   * Handle task creation
   * @param {Object} taskData - The new task details from the client
   */
  socket.on('task:create', (taskData) => {
    const newTask = {
      id: uuidv4(),
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'To Do',
      priority: taskData.priority || 'Medium',
      category: taskData.category || 'Feature',
      attachmentUrl: taskData.attachmentUrl || null,
      createdAt: Date.now()
    };
    
    tasks.push(newTask);
    
    // Broadcast the new task to ALL clients (including sender to confirm)
    io.emit('task:create', newTask);
  });

  /**
   * Handle task updates (editing details like title, priority, etc.)
   * @param {Object} updatedTask - The complete updated task object
   */
  socket.on('task:update', (updatedTask) => {
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updatedTask };
      // Broadcast update to all clients
      io.emit('task:update', tasks[index]);
    }
  });

  /**
   * Handle moving tasks between columns or reordering
   * @param {Object} data - Contains taskId and the new status
   */
  socket.on('task:move', (data) => {
    const { id, status } = data;
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.status = status;
      // Broadcast the move event so other clients can animate/update smoothly
      io.emit('task:move', data);
    }
  });

  /**
   * Handle task deletion
   * @param {string} taskId - The ID of the task to delete
   */
  socket.on('task:delete', (taskId) => {
    tasks = tasks.filter(t => t.id !== taskId);
    // Notify all clients to remove the task from their UI
    io.emit('task:delete', taskId);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`WebSocket Server running on port ${PORT}`);
});
