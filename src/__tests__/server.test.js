'use strict';

const supertest = require('supertest');
const { app } = require('../server');
const request = supertest(app);
const { sequelizeDatabase } = require('../auth/models/index');

beforeAll(async () => {
  await sequelizeDatabase.sync();
});

afterAll(async () => {
  await sequelizeDatabase.drop();
});

describe('API Server', () => {
  it('should create a new user', async () => {
    let response = await request.post('/signup').send({
      username: 'test',
      password: 'test',
    });
    expect(response.body.username).toEqual('test');
  });
});
