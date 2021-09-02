/* eslint-disable jest/no-commented-out-tests */
const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Project } = require('../../src/models');
const { userOne, admin, insertUsers, client, adminTwo } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const { projectOne, projectTwo, projectThree, insertProjects } = require('../fixtures/project.fixture');

setupTestDB();

describe('Project routes', () => {
  describe('POST /v1/project', () => {
    let newProject;

    beforeEach(() => {
      newProject = {
        client: client._id,
        title: faker.lorem.sentence(3),
        description: faker.lorem.sentence(5),
        dueDate: faker.date.future(2),
      };
    });

    test('should return 201 and successfully create new Project item if data is ok', async () => {
      await insertUsers([admin, client]);

      const res = await request(app)
        .post('/v1/project')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newProject)
        .expect(httpStatus.CREATED);

      expect(res.body.title).toBe(newProject.title);
      expect(res.body.description).toBe(newProject.description);

      const dbProject = await Project.findById(res.body.id);
      expect(dbProject).toBeDefined();
      // expect(dbProject).toMatchObject({ title: newProject.title, category: newProject.category, description: newProject.description, link: newProject.link, gallery: newProject.gallery });
      expect(dbProject.title).toBe(newProject.title);
      expect(dbProject.description).toBe(newProject.description);
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/project').send(newProject).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if logged in user is not admin', async () => {
      await insertUsers([userOne, client]);

      await request(app)
        .post('/v1/project')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newProject)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 error if client is not found', async () => {
      await insertUsers([admin]);

      await request(app)
        .post('/v1/project')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newProject)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('GET /v1/project', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([admin, client]);
      await insertProjects([projectOne, projectTwo, projectThree]);

      const res = await request(app).get('/v1/project').send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[0].id).toBe(projectOne._id);
    });

    test('should correctly apply filter on title field', async () => {
      await insertUsers([admin, client]);
      await insertProjects([projectOne, projectTwo, projectThree]);

      const res = await request(app).get('/v1/project').query({ title: projectTwo.title }).send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 1,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(projectTwo._id);
    });

    test('should correctly apply filter on client field', async () => {
      await insertUsers([admin, client]);
      await insertProjects([projectOne, projectTwo, projectThree]);

      const res = await request(app).get('/v1/project').query({ client: projectOne.client }).send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(projectOne._id);
    });

    test('should correctly sort returned array if descending sort param is specified', async () => {
      await insertUsers([admin, client]);
      await insertProjects([projectOne, projectTwo, projectThree]);

      const res = await request(app).get('/v1/project').query({ sortBy: '_id:desc' }).send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[0].id).toBe(projectThree._id);
      expect(res.body.results[1].id).toBe(projectTwo._id);
      expect(res.body.results[2].id).toBe(projectOne._id);
    });

    test('should correctly sort returned array if ascending sort param is specified', async () => {
      await insertUsers([admin, client]);
      await insertProjects([projectOne, projectTwo, projectThree]);

      const res = await request(app).get('/v1/project').query({ sortBy: '_id:asc' }).send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[0].id).toBe(projectOne._id);
      expect(res.body.results[1].id).toBe(projectTwo._id);
      expect(res.body.results[2].id).toBe(projectThree._id);
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertUsers([admin, client]);
      await insertProjects([projectOne, projectTwo, projectThree]);

      const res = await request(app).get('/v1/project').query({ limit: 2 }).send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 2,
        totalPages: 2,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0].id).toBe(projectOne._id);
      expect(res.body.results[1].id).toBe(projectTwo._id);
    });

    test('should return the correct page if page and limit params are specified', async () => {
      await insertUsers([admin, client]);
      await insertProjects([projectOne, projectTwo, projectThree]);

      const res = await request(app).get('/v1/project').query({ page: 2, limit: 2 }).send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 2,
        limit: 2,
        totalPages: 2,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].id).toBe(projectThree._id);
    });

    test('should return 400 error if client is not a valid mongo id', async () => {
      await insertUsers([client]);
      await insertProjects([projectOne]);

      await request(app).get('/v1/project').query({ client: 'invalidId' }).send().expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/project/:projectId', () => {
    test('should return 200 and the Project object if data is ok', async () => {
      await insertUsers([admin, client]);
      await insertProjects([projectOne]);

      const res = await request(app)
        .get(`/v1/project/${projectOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body.id).toBe(projectOne._id);
    });

    test('should return 401 error if access token is missing', async () => {
      await insertProjects([projectOne]);

      await request(app).get(`/v1/project/${projectOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 error if ProjectId is not a valid mongo id', async () => {
      await insertUsers([admin, client]);
      await insertProjects([projectOne]);

      await request(app)
        .get('/v1/project/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if Project is not found', async () => {
      await insertUsers([admin, client]);
      await insertProjects([projectOne]);

      await request(app)
        .get(`/v1/project/${projectTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/project/:projectId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([admin, client]);
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

    test('should return 400 error if ProjectId is not a valid mongo id', async () => {
      await insertUsers([admin, client]);
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

  describe('PATCH /v1/project/:projectId', () => {
    test('should return 200 and successfully update Project if data is ok', async () => {
      await insertUsers([admin, adminTwo, client]);
      await insertProjects([projectOne]);
      const updateBody = {
        client: adminTwo._id,
        title: faker.lorem.sentence(3),
        description: faker.lorem.sentence(5),
        dueDate: faker.date.future(2),
      };

      const res = await request(app)
        .patch(`/v1/project/${projectOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body.id).toBe(projectOne._id);
      expect(res.body.title).toBe(updateBody.title);
      expect(res.body.description).toBe(updateBody.description);

      const dbProject = await Project.findById(projectOne._id);
      expect(dbProject).toBeDefined();
      // expect(dbProject).toMatchObject({ title: updateBody.title, category: updateBody.category, description: updateBody.description, link: updateBody.link, gallery: updateBody.gallery });
      expect(dbProject.title).toBe(updateBody.title);
      expect(dbProject.description).toBe(updateBody.description);
    });

    test('should return 401 error if access token is missing', async () => {
      await insertProjects([projectOne]);
      const updateBody = { title: faker.lorem.word() };

      await request(app).patch(`/v1/project/${projectOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 if admin is updating project that does not exist', async () => {
      await insertUsers([admin]);
      await insertProjects([projectOne]);
      const updateBody = { title: faker.lorem.word() };

      await request(app)
        .patch(`/v1/project/${projectTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 404 if client does not exist', async () => {
      await insertUsers([admin]);
      await insertProjects([projectOne]);
      const updateBody = { client: client._id };

      await request(app)
        .patch(`/v1/project/${projectTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if ProjectId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertProjects([projectOne]);
      const updateBody = { title: faker.lorem.word() };

      await request(app)
        .patch(`/v1/project/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
