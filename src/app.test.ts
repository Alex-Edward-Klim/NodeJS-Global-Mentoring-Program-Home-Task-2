import request from 'supertest';
import app from './app';

describe('get all users', () => {
  test('should respond with 200 and contain array of users', async () => {
    const response = await request(app).get('/users').send();

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });
});

describe('get user by id', () => {
  test('should respond with 200 and contain user data', async () => {
    const response = await request(app).get('/users/c044ef2b-97b3-44d9-9f95-f5788c7f2647').send();

    expect(response.statusCode).toBe(200);
    expect(response.body.login).toEqual('A');
    expect(response.body.password).toEqual('123xyz');
    expect(response.body.age).toEqual(21);
    expect(response.body.id).toEqual('c044ef2b-97b3-44d9-9f95-f5788c7f2647');
  });
});

describe('create a user', () => {
  test('should respond with 200 and contain new user data', async () => {
    const response = await request(app).post('/users').send({
      login: 'xyzabc',
      password: '123xyz',
      age: 21,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.login).toBeDefined();
    expect(response.body.password).toBeDefined();
    expect(response.body.age).toBeDefined();
    expect(response.body.id).toBeDefined();
  });
});

describe('check if user already exists', () => {
  test('should respond with 200 and 400 status code', async () => {
    const testApp = request(app);

    const response = await testApp.post('/users').send({
      login: 'abcxyz',
      password: '123xyz',
      age: 21,
    });

    const secondResponse = await testApp.post('/users').send({
      login: 'abcxyz',
      password: '123xyz',
      age: 21,
    });

    expect(response.statusCode).toBe(200);
    expect(secondResponse.statusCode).toBe(400);
  });
});

describe('update user by id', () => {
  test('should respond with 200 and contain updated user data', async () => {
    const response = await request(app).patch('/users/c044ef2b-97b3-44d9-9f95-f5788c7f2647').send({
      age: 32,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.age).toEqual(32);
  });
});

describe('delete user by id', () => {
  test('should respond with 200 and isDeleted', async () => {
    const response = await request(app).delete('/users/c044ef2b-97b3-44d9-9f95-f5788c7f2647').send();

    expect(response.statusCode).toBe(200);
    expect(response.body.isDeleted).toEqual(true);
  });
});
