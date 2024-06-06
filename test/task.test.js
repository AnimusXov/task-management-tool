import request from 'supertest';
import app from '../server.js'; // Adjust the path if necessary
import mongoose from 'mongoose';
import { use, expect } from 'chai';
import User from '../models/User.js';
import Task from '../models/Task.js';
import jwt from 'jsonwebtoken';

describe('Task API', () => {
  let token;
  let userId;

before(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

  after(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});

    const user = await new User({ username: 'testuser', password: 'testpassword' }).save();
    userId = user.id;

    const payload = {
      user: {
        id: user.id
      }
    };

    token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('x-auth-token', token)
        .send({
          title: 'Test Task',
          description: 'Test Description',
          assignedTo: userId,
          dueDate: new Date()
        });
      expect(res.status).to.equal(201);
      expect(res.body.title).to.equal('Test Task');
    });

    it('should not create a task without title', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('x-auth-token', token)
        .send({
          description: 'Test Description',
          assignedTo: userId,
          dueDate: new Date()
        });
      expect(res.status).to.equal(500); // Expecting server error due to missing title
    });
  });

  describe('GET /api/tasks', () => {
    it('should get all tasks', async () => {
      const task = new Task({
        title: 'Test Task',
        description: 'Test Description',
        assignedTo: userId,
        dueDate: new Date()
      });
      await task.save();

      const res = await request(app)
        .get('/api/tasks')
        .set('x-auth-token', token);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.lengthOf(1);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      const task = new Task({
        title: 'Test Task',
        description: 'Test Description',
        assignedTo: userId,
        dueDate: new Date()
      });
      await task.save();

      const res = await request(app)
        .put(`/api/tasks/${task.id}`)
        .set('x-auth-token', token)
        .send({
          title: 'Updated Task',
          description: 'Updated Description',
          status: 'In Progress'
        });
      expect(res.status).to.equal(200);
      expect(res.body.title).to.equal('Updated Task');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const task = new Task({
        title: 'Test Task',
        description: 'Test Description',
        assignedTo: userId,
        dueDate: new Date()
      });
      await task.save();

      const res = await request(app)
        .delete(`/api/tasks/${task.id}`)
        .set('x-auth-token', token);
      expect(res.status).to.equal(200);
      expect(res.body.msg).to.equal('Task removed');
    });
  });
});
