const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:5000', // Adjust if your frontend runs on a different port
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.static('public'));

// MongoDB connection string - replace <password> with your actual password
const mongoURI = 'mongodb+srv://tuhinac2004:dyst0pia@todoapp.9mlr6em.mongodb.net/ToDoApp?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  serverSelectionTimeoutMS: 30000 // Increase timeout to 30 seconds
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit the process with failure
});

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  priority: { type: String, enum: ['low', 'medium', 'high'] },
  dueDate: Date,
  completed: Boolean,
});

const Task = mongoose.model('Task', TaskSchema);

// Create a task
app.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(400).send(error);
  }
});

// Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.send(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).send(error);
  }
});

// Update a task
app.patch('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(400).send(error);
  }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).send(error);
  }
});

// Basic route to test server
app.get('/', (req, res) => {
  res.send('Hello from the Task Manager API');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));