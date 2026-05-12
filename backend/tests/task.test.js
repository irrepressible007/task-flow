/**
 * task.test.js — Backend Unit Tests
 *
 * Tests the POST /api/tasks endpoint using:
 *  - supertest    : makes HTTP requests to the Express app without a running server
 *  - mongodb-memory-server : spins up a real in-memory MongoDB so no real DB is needed
 *
 * Run with: npm test
 */

const request  = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');

let mongoServer;

// ── Setup: start in-memory MongoDB before all tests ──────────────────────────
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri   = mongoServer.getUri();
  await mongoose.connect(uri);
});

// ── Teardown: disconnect and stop in-memory server after all tests ────────────
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// ── Clear the tasks collection between tests ──────────────────────────────────
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Test suite: POST /api/tasks
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/tasks — Create Task', () => {
  it('should return 400 when title is missing', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ description: 'No title provided' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Title is required');
  });

  it('should return 400 when title is an empty string', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: '   ' }); // whitespace only, trimmed to empty

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Title is required');
  });

  it('should return 201 and the created task when title is valid', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Write unit tests', description: 'Cover all endpoints' });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toMatchObject({
      title:    'Write unit tests',
      description: 'Cover all endpoints',
      status:   'pending',   // default
      priority: 'medium',    // default
    });
    // createdAt and updatedAt should be present
    expect(res.body.data).toHaveProperty('createdAt');
    expect(res.body.data).toHaveProperty('updatedAt');
  });

  it('should return 400 when an invalid status is provided', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Valid Title', status: 'archived' }); // not a valid enum value

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test suite: GET /api/tasks
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/tasks — Get All Tasks', () => {
  it('should return 200 with an empty array when no tasks exist', async () => {
    const res = await request(app).get('/api/tasks');

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it('should return all tasks after one is created', async () => {
    // First create a task
    await request(app).post('/api/tasks').send({ title: 'Test Task' });

    const res = await request(app).get('/api/tasks');

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe('Test Task');
  });
});
