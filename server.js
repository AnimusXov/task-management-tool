import express from 'express';
import connectDB from './config/db.js'; // Assuming db.js exports a function named 'connectDB'
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(import.meta.url, 'public'))); // Serve static files

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(import.meta.url, 'views'));

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Route to render the home page
app.get('/', (req, res) => {
  res.render('index', { title: 'Task Management Tool' });
});

// Route to render the register page
app.get('/register', (req, res) => {
  res.render('register');
});

// Route to render the login page
app.get('/login', (req, res) => {
  res.render('login');
});

// Route to render the tasks page
app.get('/tasks', (req, res) => {
  // Assuming you have a Task model and you are fetching tasks for the logged-in user
  const tasks = []; // Fetch tasks from the database
  res.render('tasks', { tasks });
});

const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default app; // Export the app for testing
