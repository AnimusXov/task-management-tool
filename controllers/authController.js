import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    user = new User({ username, password });
    await user.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log('Login request:', username, password);
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const payload = {
      user: {
        id: user.id
      }
    };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        console.error('Error signing token:', err);
        return res.status(500).json({ msg: 'Server error' });
      }
      res.json({ token });
    });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
