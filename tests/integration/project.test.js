/* eslint-disable jest/no-commented-out-tests */
const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Project } = require('../../src/models');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const {
  projectOne,
  projectTwo,
  projectThree,
  projectFour,
  insertProjects,
  taskOne,
  taskTwo,
  taskThree,
  insertTasks,
} = require('../fixtures/project.fixture');

setupTestDB();

describe('Project routes', () => {
  describe('POST /v1/project', () => {
    let newProject;

    beforeEach(() => {
      newProject = {
        clientId: mongoose.Types.ObjectId(),
        name: faker.lorem.sentence(3),
        description: faker.lorem.sentence(5),
        dueDate: faker.date.future(2),
        stack: faker.lorem.word(),
      };
    });

    test('should return 201 and successfully create new Project item if data is ok', async () => {
      await insertUsers([admin]);
      await insertProjects([projectOne]);

      const res = await request(app)
        .post('/v1/project')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newProject)
        .expect(httpStatus.CREATED);

      //   expect(res.body).toEqual({
      //     id: expect.anything(),
      //     name: newProject.name,
      //     description: newProject.description,
      //     projectName: newProject.projectName,
      //     dueDate: expect.anything(),
      //     stack: newProject.stack,
      //   });

      const dbProject = await Project.findById(res.body.id);
      expect(dbProject).toBeDefined();
      // expect(dbProject).toMatchObject({ title: newProject.title, category: newProject.category, description: newProject.description, link: newProject.link, gallery: newProject.gallery });
      expect(dbProject.name).toBe(newProject.name);
      expect(dbProject.description).toBe(newProject.description);
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/project').send(newProject).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if logged in user is not admin', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/v1/project')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newProject)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('GET /v1/project', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertProjects([projectOne, projectTwo, projectThree]);

      const res = await request(app)
        .get('/v1/project')
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
      expect(res.body.results[0].id).toBe(projectOne._id.toHexString());
    });

    test('should return 401 if access token is missing', async () => {
      await insertProjects([projectOne, projectTwo, projectThree]);

      await request(app).get('/v1/project').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin or non-Project is trying to access all items', async () => {
      await insertUsers([userOne]);
      await insertProjects([projectOne, projectTwo, projectThree]);

      await request(app)
        .get('/v1/project')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should correctly apply filter on name field', async () => {
      await insertUsers([admin]);
      await insertProjects([projectOne, projectTwo, projectThree]);

      const res = await request(app)
        .get('/v1/project')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ name: projectTwo.name })
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
      expect(res.body.results[0].id).toBe(projectTwo._id.toHexString());
    });

    test('should correctly apply filter on clientId field', async () => {
      await insertUsers([admin]);
      await insertProjects([projectOne, projectTwo, projectThree]);

      const res = await request(app)
        .get('/v1/project')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ clientId: projectTwo.clientId })
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
      expect(res.body.results[0].id).toBe(projectTwo._id.toHexString());
    });

    test('should correctly apply filter on stack field', async () => {
      await insertUsers([admin]);
      await insertProjects([projectOne, projectTwo, projectThree]);

      const res = await request(app)
        .get('/v1/project')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ stack: projectOne.stack })
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
      expect(res.body.results[0].id).toBe(projectOne._id.toHexString());
    });

    test('should correctly sort returned array if descending sort param is specified', async () => {
      await insertUsers([admin]);
      await insertProjects([projectOne, projectTwo, projectThree]);

      const res = await request(app)
        .get('/v1/project')
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
      expect(res.body.results[0].id).toBe(projectOne._id.toHexString());
      expect(res.body.results[1].id).toBe(projectTwo._id.toHexString());
      expect(res.body.results[2].id).toBe(projectThree._id.toHexString());
    });

    test('should correctly sort returned array if ascending sort param is specified', async () => {
      await insertUsers([admin]);
      await insertProjects([projectOne, projectTwo, projectThree]);

      const res = await request(app)
        .get('/v1/project')
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
      expect(res.body.results[0].id).toBe(projectOne._id.toHexString());
      expect(res.body.results[1].id).toBe(projectTwo._id.toHexString());
      expect(res.body.results[2].id).toBe(projectThree._id.toHexString());
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertUsers([admin]);
      await insertProjects([projectOne, projectTwo, projectThree]);

      const res = await request(app)
        .get('/v1/project')
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
      expect(res.body.results[0].id).toBe(projectOne._id.toHexString());
      expect(res.body.results[1].id).toBe(projectTwo._id.toHexString());
    });

    test('should return the correct page if page and limit params are specified', async () => {
      await insertUsers([admin]);
      await insertProjects([projectOne, projectTwo, projectThree]);

      const res = await request(app)
        .get('/v1/project')
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
      expect(res.body.results[0].id).toBe(projectThree._id.toHexString());
    });

    test('should return 400 error if clientId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertProjects([projectOne]);

      await request(app)
        .get('/v1/project')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ clientId: 'invalidId' })
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/project/:ProjectId', () => {
    test('should return 200 and the Project object if data is ok', async () => {
      await insertUsers([admin]);
      await insertProjects([projectOne]);

      const res = await request(app)
        .get(`/v1/project/${projectOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body.id).toBe(projectOne._id.toHexString());
    });

    test('should return 401 error if access token is missing', async () => {
      await insertProjects([projectOne]);

      await request(app).get(`/v1/project/${projectOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    // getting someone else's items

    test('should return 400 error if ProjectId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertProjects([projectOne]);

      await request(app)
        .get('/v1/project/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if Project is not found', async () => {
      await insertUsers([admin]);
      await insertProjects([projectOne]);

      await request(app)
        .get(`/v1/project/${projectTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('GET /v1/project/tasks/:ProjectId', () => {
    beforeEach(async () => {
      await insertTasks([taskOne, taskTwo, taskThree]);
    });
    test('should return 200 and the task data array if data is ok', async () => {
      await insertUsers([admin]);
      await insertProjects([projectThree]);

      const res = await request(app)
        .get(`/v1/project/tasks/${projectThree._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body.length).toBe(3);
      // expect(res.body[0].id).toBe(taskOne._id).toHexString();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertProjects([projectThree]);

      await request(app).get(`/v1/project/tasks/${projectThree._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if ProjectId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertProjects([projectThree]);

      await request(app)
        .get('/v1/project/tasks/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if Project is not found', async () => {
      await insertUsers([admin]);
      await insertProjects([projectThree]);

      await request(app)
        .get(`/v1/project/tasks/${projectTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 404 error if Project has no tasks', async () => {
      await insertUsers([admin]);
      await insertProjects([projectOne]);

      await request(app)
        .get(`/v1/project/tasks/${projectOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 404 error if Project has invalid tasks', async () => {
      await insertUsers([admin]);
      await insertProjects([projectFour]);

      await request(app)
        .get(`/v1/project/tasks/${projectFour._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/project/:ProjectId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([admin]);
      await insertProjects([projectOne]);

      await request(app)
        .delete(`/v1/project/${projectOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbProject = await Project.findById(projectOne._id);
      expect(dbProject).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);

      await request(app).delete(`/v1/project/${projectOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    // User trying to delete someone else's items

    // admin trying to delete someone else's items

    // User assigning someone else item

    test('should return 400 error if ProjectId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertProjects([projectOne]);

      await request(app)
        .delete('/v1/project/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if Project is not found', async () => {
      await insertUsers([admin]);
      await insertProjects([projectOne]);

      await request(app)
        .delete(`/v1/project/${projectTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/project/:ProjectId', () => {
    test('should return 200 and successfully update Project if data is ok', async () => {
      await insertUsers([admin]);
      await insertProjects([projectOne]);
      const updateBody = {
        clientId: mongoose.Types.ObjectId(),
        name: faker.lorem.sentence(3),
        description: faker.lorem.sentence(5),
        dueDate: faker.date.future(2),
        stack: faker.lorem.word(),
        tasks: ['5ebac534954b54139806c583', '5ebac534954b54139806c584', '5ebac534954b54139806c585'],
      };

      const res = await request(app)
        .patch(`/v1/project/${projectOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      //   expect(res.body).toEqual({
      //     id: projectOne._id.toHexString(),
      //     name: updateBody.name,
      //     description: updateBody.description,
      //     projectName: updateBody.projectName,
      //     dueDate: updateBody.dueDate,
      //     stack: updateBody.stack,
      //   });
      expect(res.body.id).toBe(projectOne._id.toHexString());

      const dbProject = await Project.findById(projectOne._id);
      expect(dbProject).toBeDefined();
      // expect(dbProject).toMatchObject({ title: updateBody.title, category: updateBody.category, description: updateBody.description, link: updateBody.link, gallery: updateBody.gallery });
      expect(dbProject.name).toBe(updateBody.name);
      expect(dbProject.description).toBe(updateBody.description);
    });

    test('should return 401 error if access token is missing', async () => {
      await insertProjects([projectOne]);
      const updateBody = { name: faker.lorem.word() };

      await request(app).patch(`/v1/project/${projectOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    // user updating another user's items

    // admin updating another user's items

    test('should return 404 if admin is updating project that does not exist', async () => {
      await insertUsers([admin]);
      await insertProjects([projectOne]);
      const updateBody = { name: faker.lorem.word() };

      await request(app)
        .patch(`/v1/project/${projectTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if ProjectId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertProjects([projectOne]);
      const updateBody = { name: faker.lorem.word() };

      await request(app)
        .patch(`/v1/project/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
