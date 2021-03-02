require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

    const testTodo1 = {
      todo: 'test todo item',
      completed: false,
    };


    const dbTestTodo = {
      todo:'test todo item',
      completed: false,
      user_id: 2,
      id: 4,
    };
    
    test('creates a todo list item for user jon@user.com', async() => {

      const data = await fakeRequest(app)
        .post('/api/todos')
        .set('Authorization', token)
        .send(testTodo1)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(dbTestTodo);
    });

    test('returns all todo list items for user jon@user.com', async() => {

      const data = await fakeRequest(app)
        .get('/api/todos')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual([
        {
          todo:'test todo item',
          completed: false,
          user_id: 2,
          id: 4,
        }
      ]);
    });

    test('creates a todo list item for user jon@user.com', async() => {

      const data = await fakeRequest(app)
        .post('/api/todos')
        .set('Authorization', token)
        .send(testTodo1)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(dbTestTodo);
    }); 
  });
});
