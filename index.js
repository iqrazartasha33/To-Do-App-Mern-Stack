const express = require('express');
const mongoose = require('mongoose');
const Todo = require('./models/Todo'); 
const app = express();
const cors = require('cors');
app.use(cors());


app.use(express.json());

mongoose.connect('mongodb://localhost:27017/todoApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find({}, { _id: 0, id: 1, task: 1, completed: 1 });
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch todos' });
  }
});

app.post('/todos', async (req, res) => {
  const { task } = req.body;

  if (!task || typeof task !== 'string') {
    return res.status(400).json({ message: 'Task is required and must be a string' });
  }

  try {
    const lastTodo = await Todo.findOne().sort({ id: -1 });
    const newId = lastTodo && lastTodo.id ? lastTodo.id + 1 : 1;

    const newTodo = new Todo({
      id: newId,
      task,
      completed: false
    });

    await newTodo.save();
    res.status(201).json({ message: 'New task added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to save todo' });
  }
});

app.put('/todos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { task, completed } = req.body;

  try {
    const updateData = {};
    if (task !== undefined) updateData.task = task.trim();
    if (completed !== undefined) updateData.completed = completed;

    const updatedTodo = await Todo.findOneAndUpdate(
      { id },
      updateData,
      { new: true }
    );

    if (updatedTodo) {
      res.json(updatedTodo);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update todo' });
  }
});

app.delete('/todos/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const deletedTodo = await Todo.findOneAndDelete({ id });

    if (deletedTodo) {
      res.json({ message: 'Task deleted successfully' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete todo' });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});
