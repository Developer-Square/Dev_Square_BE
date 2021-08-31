const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Task } = require('../../src/models');
const { userOne, admin, insertUsers, adminTwo, client } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken, clientAccessToken } = require('../fixtures/token.fixture');
const { taskOne, taskTwo, taskThree, insertTasks, taskFour, taskFive, taskSix } = require('../fixtures/task.fixture');
const { projectOne, insertProjects, projectTwo } = require('../fixtures/project.fixture');

setupTestDB();

describe('Task routes', () => {
  describe('POST /v1/tasks', () => {
    let newTask;

    beforeEach(() => {
      newTask = {
        title: faker.lorem.sentence(3),
        creator: admin._id,
        project: projectOne._id,
        description: faker.lorem.paragraph(),
        dueDate: faker.date.future(2),
      };
    });

    test('should return 201 and successfully create new task if data is ok', async () => {
      await insertUsers([admin]);
      await insertProjects([projectOne]);

      const res = await request(app)
        .post('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newTask)
        .expect(httpStatus.CREATED);

      expect(res.body.title).toBe(newTask.title);
      expect(res.body.description).toBe(newTask.description);

      const dbTask = await Task.findById(res.body.id);
      expect(dbTask).toBeDefined();
      expect(dbTask.title).toBe(newTask.title);
      expect(dbTask.description).toBe(newTask.description);
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
  });

  describe('GET /v1/tasks', () => {
    beforeEach(async () => {
      await insertUsers([admin, adminTwo]);
      await insertProjects([projectOne, projectTwo]);
      await insertTasks([taskOne, taskTwo, taskThree, taskFour, taskFive, taskSix]);
    });
    test('should return 200 and apply the default query options', async () => {
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
        totalResults: 6,
      });
      expect(res.body.results).toHaveLength(6);
      expect(res.body.results[0].id).toBe(taskOne._id);
      expect(res.body.results[0].creator).toBe(taskOne.creator);
      expect(res.body.results[0].status).toBe(taskOne.status);
      expect(res.body.results[0].project).toBe(taskOne.project);
    });

    test('should return 401 if access token is missing', async () => {
      await request(app).get('/v1/tasks').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 200 if a client is trying to access all tasks', async () => {
      await insertUsers([client]);

      await request(app).get('/v1/tasks').set('Authorization', `Bearer ${clientAccessToken}`).send().expect(httpStatus.OK);
    });

    test('should correctly apply filter on project field', async () => {
      const res = await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ project: taskOne.project })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 5,
      });
      expect(res.body.results).toHaveLength(5);
      expect(res.body.results[1].id).toBe(taskThree._id);
    });

    test('should correctly apply filter on status field', async () => {
      const res = await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ status: taskOne.status })
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
      expect(res.body.results[0].id).toBe(taskOne._id);
    });

    test('should correctly apply filter on title field', async () => {
      const res = await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ title: taskSix.title })
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
      expect(res.body.results[0].id).toBe(taskSix._id);
    });

    test('should correctly apply filter on creator field', async () => {
      const res = await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ creator: taskThree.creator })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 4,
      });
      expect(res.body.results).toHaveLength(4);
      expect(res.body.results[0].id).toBe(taskThree._id);
      expect(res.body.results[1].id).toBe(taskFour._id);
      expect(res.body.results[2].id).toBe(taskFive._id);
      expect(res.body.results[3].id).toBe(taskSix._id);
    });

    test('should correctly sort returned array if descending sort param is specified', async () => {
      const res = await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: '_id:desc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 6,
      });
      expect(res.body.results).toHaveLength(6);
      expect(res.body.results[0].id).toBe(taskSix._id);
      expect(res.body.results[1].id).toBe(taskFive._id);
      expect(res.body.results[2].id).toBe(taskFour._id);
      expect(res.body.results[3].id).toBe(taskThree._id);
      expect(res.body.results[4].id).toBe(taskTwo._id);
      expect(res.body.results[5].id).toBe(taskOne._id);
    });

    test('should correctly sort returned array if ascending sort param is specified', async () => {
      const res = await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ sortBy: '_id:asc' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 6,
      });
      expect(res.body.results).toHaveLength(6);
      expect(res.body.results[0].id).toBe(taskOne._id);
      expect(res.body.results[1].id).toBe(taskTwo._id);
      expect(res.body.results[2].id).toBe(taskThree._id);
      expect(res.body.results[3].id).toBe(taskFour._id);
      expect(res.body.results[4].id).toBe(taskFive._id);
      expect(res.body.results[5].id).toBe(taskSix._id);
    });

    test('should limit returned array if limit param is specified', async () => {
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
        totalPages: 3,
        totalResults: 6,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(taskOne._id);
      expect(res.body.results[1].id).toBe(taskTwo._id);
    });

    test('should return the correct page if page and limit params are specified', async () => {
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
        totalPages: 3,
        totalResults: 6,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(taskThree._id);
      expect(res.body.results[1].id).toBe(taskFour._id);
    });

    test('should return 400 error if creator is not a valid mongo id', async () => {
      await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ creator: 'invalidCreator' })
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if project is not a valid mongo id', async () => {
      await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ project: 'invalidProject' })
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if status is unknown', async () => {
      await request(app)
        .get('/v1/tasks')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ status: 'invalidStatus' })
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/tasks/:taskId', () => {
    test('should return 200 and the task object if data is ok', async () => {
      await insertUsers([admin]);
      await insertProjects([projectOne]);
      await insertTasks([taskOne]);

      const res = await request(app)
        .get(`/v1/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body.id).toBe(taskOne._id);
      expect(res.body.description).toBe(taskOne.description);
      expect(res.body.status).toBe('notStarted');
    });

    test('should return 401 error if access token is missing', async () => {
      await insertTasks([taskOne]);

      await request(app).get(`/v1/tasks/${taskOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if taskId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertProjects([projectOne]);
      await insertTasks([taskOne]);

      await request(app)
        .get('/v1/tasks/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if task is not found', async () => {
      await insertUsers([admin]);
      await insertProjects([projectOne]);
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
    let updateBody;
    beforeEach(async () => {
      await insertUsers([admin, adminTwo]);
      await insertProjects([projectOne, projectTwo]);
      await insertTasks([taskOne]);
      updateBody = {
        project: projectTwo._id,
        creator: adminTwo._id,
        description: faker.lorem.paragraph(),
        dueDate: faker.date.future(2),
        status: 'inProgress',
      };
    });
    test('should return 200 and successfully update task if data is ok', async () => {
      const res = await request(app)
        .patch(`/v1/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body.id).toBe(taskOne._id);
      expect(res.body.creator).toBe(updateBody.creator);
      expect(res.body.status).toBe(updateBody.status);
      expect(res.body.project).toBe(updateBody.project);
      expect(res.body.description).toBe(updateBody.description);

      const dbTask = await Task.findById(taskOne._id);
      expect(dbTask).toBeDefined();
      expect(dbTask.id).toBe(taskOne._id);
      expect(dbTask.status).toBe(updateBody.status);
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).patch(`/v1/tasks/${taskOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 if admin is updating task that is not found', async () => {
      await request(app)
        .patch(`/v1/tasks/${taskTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if taskId is not a valid mongo id', async () => {
      await request(app)
        .patch(`/v1/tasks/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if status is unknown', async () => {
      updateBody.status = 'invalid';

      await request(app)
        .patch(`/v1/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if creator is not a valid mongo ID', async () => {
      updateBody.creator = 'invalid';

      await request(app)
        .patch(`/v1/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if project is not a valid mongo ID', async () => {
      updateBody.project = 'invalid';

      await request(app)
        .patch(`/v1/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
