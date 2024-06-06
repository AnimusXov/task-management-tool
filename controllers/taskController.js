import Task from '../models/Task.js';

export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;
    const newTask = new Task({ title, description, assignedTo, dueDate });
    const task = await newTask.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', ['username']);
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, description, status, assignedTo, dueDate } = req.body;
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, status, assignedTo, dueDate } },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    await Task.deleteOne({ _id: req.params.id }); // Corrected deletion
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};