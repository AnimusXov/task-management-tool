import request from 'supertest';
import app from '../server.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { use, expect } from 'chai';



describe('Auth API', () => {
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'testpassword'
        });
      expect(res.status).to.equal(201);
      expect(res.body.msg).to.equal('User registered successfully');
    });

    it('should not register a user with the same username', async () => {
      await new User({ username: 'testuser', password: 'testpassword' }).save();
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'testpassword'
        });
      expect(res.status).to.equal(400);
      expect(res.body.msg).to.equal('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      await new User({ username: 'testuser', password: 'testpassword' }).save();
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'testpassword'
        });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('token');
    });

    it('should not login with incorrect password', async () => {
      await new User({ username: 'testuser', password: 'testpassword' }).save();
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });
      expect(res.status).to.equal(400);
      expect(res.body.msg).to.equal('Invalid credentials');
    });
  });
});
