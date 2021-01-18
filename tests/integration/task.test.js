const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Task } = require('../../src/models');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const { taskOne, taskTwo, taskThree, insertTasks } = require('../fixtures/task.fixture');

setupTestDB();

describe('Task routes', () => {
  describe('POST /v1/tasks', () => {
    let newTask;

    beforeEach(() => {
      newTask = {
        stack: 'node',
        creator: mongoose.Types.ObjectId(),
        description: faker.lorem.paragraph(),
        dueDate: faker.date.future(2),
        difficulty: 'medium',
      };
    });

    test('should return 201 and successfully create new task if data is ok', async () => {
      await insertUsers([admin]);
      await insertTasks([taskOne]);

      const res = await request(app)
        .post('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newTask)
        .expect(httpStatus.CREATED);

      expect(res.body.stack).toBe(newTask.stack);

      const dbTask = await Task.findById(res.body.id);
      expect(dbTask).toBeDefined();
      expect(dbTask.stack).toBe(newTask.stack);
      expect(dbTask.status).toBe('notStarted');
      expect(dbTask.assigned).toBe(false);
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/tasks').send(newTask).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if logged in user is not admin', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/v1/tasks')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newTask)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if difficulty is unknown', async () => {
      await insertUsers([admin]);
      newTask.difficulty = 'invalid';

      await request(app)
        .post('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newTask)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if status is unknown', async () => {
      await insertUsers([admin]);
      newTask.status = 'invalid';

      await request(app)
        .post('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newTask)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/tasks', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertTasks([taskOne, taskTwo, taskThree]);

      const res = await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[0].id).toBe(taskOne._id.toHexString());
      expect(res.body.results[0].stack).toBe(taskOne.stack);
      expect(res.body.results[0].status).toBe('notStarted');
      expect(res.body.results[0].assigned).toBe(false);
      expect(res.body.results[2].assigned).toBe(true);
    });

    test('should return 401 if access token is missing', async () => {
      await insertTasks([taskOne, taskTwo, taskThree]);

      await request(app).get('/v1/tasks').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin is trying to access all tasks', async () => {
      await insertUsers([userOne]);
      await insertTasks([taskOne, taskTwo, taskThree]);

      await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should correctly apply filter on stack field', async () => {
      await insertUsers([admin]);
      await insertTasks([taskOne, taskTwo, taskThree]);

      const res = await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ stack: taskOne.stack })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(taskOne._id.toHexString());
    });

    test('should correctly apply filter on status field', async () => {
      await insertUsers([admin]);
      await insertTasks([taskOne, taskTwo, taskThree]);

      const res = await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ status: taskThree.status })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 1,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(taskThree._id.toHexString());
    });

    test('should correctly apply filter on assigned field', async () => {
      await insertUsers([admin]);
      await insertTasks([taskOne, taskTwo, taskThree]);

      const res = await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ assigned: true })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 1,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(taskThree._id.toHexString());
    });

    test('should correctly apply filter on difficulty field', async () => {
      await insertUsers([admin]);
      await insertTasks([taskOne, taskTwo, taskThree]);

      const res = await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ difficulty: taskTwo.difficulty })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(taskTwo._id.toHexString());
      expect(res.body.results[1].id).toBe(taskThree._id.toHexString());
    });

    test('should correctly apply filter on creator field', async () => {
      await insertUsers([admin]);
      await insertTasks([taskOne, taskTwo, taskThree]);

      const res = await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ creator: taskTwo.creator })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(taskTwo._id.toHexString());
      expect(res.body.results[1].id).toBe(taskThree._id.toHexString());
    });

    test('should correctly sort returned array if descending sort param is specified', async () => {
      await insertUsers([admin]);
      await insertTasks([taskOne, taskTwo, taskThree]);

      const res = await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'role:desc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[0].id).toBe(taskOne._id.toHexString());
      expect(res.body.results[1].id).toBe(taskTwo._id.toHexString());
      expect(res.body.results[2].id).toBe(taskThree._id.toHexString());
    });

    test('should correctly sort returned array if ascending sort param is specified', async () => {
      await insertUsers([admin]);
      await insertTasks([taskOne, taskTwo, taskThree]);

      const res = await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: 'role:asc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[0].id).toBe(taskOne._id.toHexString());
      expect(res.body.results[1].id).toBe(taskTwo._id.toHexString());
      expect(res.body.results[2].id).toBe(taskThree._id.toHexString());
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertUsers([admin]);
      await insertTasks([taskOne, taskTwo, taskThree]);

      const res = await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ limit: 2 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 2,
        totalPages: 2,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(taskOne._id.toHexString());
      expect(res.body.results[1].id).toBe(taskTwo._id.toHexString());
    });

    test('should return the correct page if page and limit params are specified', async () => {
      await insertUsers([admin]);
      await insertTasks([taskOne, taskTwo, taskThree]);

      const res = await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ page: 2, limit: 2 })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 2,
        limit: 2,
        totalPages: 2,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(taskThree._id.toHexString());
    });

    test('should return 400 error if creator is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertTasks([taskOne, taskTwo, taskThree]);

      await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ creator: 'invalidCreator' })
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if difficulty is unknown', async () => {
      await insertUsers([admin]);
      await insertTasks([taskOne, taskTwo, taskThree]);

      await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ difficulty: 'invalidDifficulty' })
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if status is unknown', async () => {
      await insertUsers([admin]);
      await insertTasks([taskOne, taskTwo, taskThree]);

      await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ status: 'invalidStatus' })
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if assigned is not boolean', async () => {
      await insertUsers([admin]);
      await insertTasks([taskOne, taskTwo, taskThree]);

      await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ assigned: 'invalidboolean' })
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/tasks/:taskId', () => {
    test('should return 200 and the task object if data is ok', async () => {
      await insertUsers([admin]);
      await insertTasks([taskOne]);

      const res = await request(app)
        .get(`/v1/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body.id).toBe(taskOne._id.toHexString());
      expect(res.body.stack).toBe(taskOne.stack);
      expect(res.body.status).toBe('notStarted');
      expect(res.body.assigned).toBe(false);
    });

    test('should return 401 error if access token is missing', async () => {
      await insertTasks([taskOne]);

      await request(app).get(`/v1/tasks/${taskOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if taskId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertTasks([taskOne]);

      await request(app)
        .get('/v1/tasks/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if task is not found', async () => {
      await insertUsers([admin]);
      await insertTasks([taskOne]);

      await request(app)
        .get(`/v1/tasks/${taskTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/tasks/:taskId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([admin]);
      await insertTasks([taskOne]);

      await request(app)
        .delete(`/v1/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbTask = await Task.findById(taskOne._id);
      expect(dbTask).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);

      await request(app).delete(`/v1/tasks/${taskOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    // User trying to delete someone else's tasks

    // admin trying to delete someone else's tasks

    // User assigning someone else task

    test('should return 400 error if taskId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertTasks([taskOne]);

      await request(app)
        .delete('/v1/tasks/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if task is not found', async () => {
      await insertUsers([admin]);
      await insertTasks([taskOne]);

      await request(app)
        .delete(`/v1/tasks/${taskTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/tasks/:taskId', () => {
    test('should return 200 and successfully update task if data is ok', async () => {
      await insertUsers([admin]);
      await insertTasks([taskOne]);
      const updateBody = {
        stack: 'react',
        creator: '5fc4aa77fbb5c260556866c6',
        description: faker.lorem.paragraph(),
        dueDate: faker.date.future(2),
        difficulty: 'easy',
        status: 'inProgress',
        assigned: true,
      };

      const res = await request(app)
        .patch(`/v1/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body.id).toBe(taskOne._id.toHexString());
      expect(res.body.stack).toBe(updateBody.stack);
      expect(res.body.status).toBe(updateBody.status);
      expect(res.body.difficulty).toBe(updateBody.difficulty);
      expect(res.body.assigned).toBe(updateBody.assigned);

      const dbTask = await Task.findById(taskOne._id);
      expect(dbTask).toBeDefined();
      expect(dbTask.id).toBe(taskOne._id.toHexString());
      expect(dbTask.stack).toBe(updateBody.stack);
      expect(dbTask.status).toBe(updateBody.status);
      expect(dbTask.difficulty).toBe(updateBody.difficulty);
      expect(dbTask.assigned).toBe(updateBody.assigned);
    });

    test('should return 401 error if access token is missing', async () => {
      await insertTasks([taskOne]);
      const updateBody = { stack: faker.lorem.word() };

      await request(app).patch(`/v1/tasks/${taskOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 if admin is updating task that is not found', async () => {
      await insertUsers([admin]);
      await insertTasks([taskOne]);
      const updateBody = { stack: faker.lorem.word() };

      await request(app)
        .patch(`/v1/tasks/${taskTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if taskId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertTasks([taskOne]);
      const updateBody = { stack: faker.lorem.word() };

      await request(app)
        .patch(`/v1/tasks/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if difficulty is unknown', async () => {
      await insertUsers([admin]);
      await insertTasks([taskOne]);
      const updateBody = { difficulty: 'invalid' };

      await request(app)
        .patch(`/v1/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if status is unknown', async () => {
      await insertUsers([admin]);
      await insertTasks([taskOne]);
      const updateBody = { status: 'invalid' };

      await request(app)
        .patch(`/v1/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if assigned is not boolean', async () => {
      await insertUsers([admin]);
      await insertTasks([taskOne]);
      const updateBody = { assigned: 'invalid' };

      await request(app)
        .patch(`/v1/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if creator is not a valid mongo ID', async () => {
      await insertUsers([admin]);
      await insertTasks([taskOne]);
      const updateBody = { creator: 'invalid' };

      await request(app)
        .patch(`/v1/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
