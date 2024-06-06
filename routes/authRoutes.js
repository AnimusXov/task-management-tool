import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ msg: 'Please provide username and password' });
  }

  try {
    // Check if username already exists
    let user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create a new user
    user = new User({
      username,
      password,
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
