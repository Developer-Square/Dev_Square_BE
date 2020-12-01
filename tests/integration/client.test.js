const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Client } = require('../../src/models');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const { clientOne, clientTwo, clientThree, insertClients } = require('../fixtures/client.fixture');

setupTestDB();

describe('Client routes', () => {
  describe('POST /v1/client', () => {
    let newClient;

    beforeEach(() => {
      newClient = {
        name: faker.lorem.word(),
        description: faker.lorem.sentence(5),
        projectName: faker.lorem.sentence(3),
        dueDate: faker.date.future(2),
        stack: [faker.lorem.word(), faker.lorem.word()],
      };
    });

    test('should return 201 and successfully create new Client item if data is ok', async () => {
      await insertUsers([admin]);
      await insertClients([clientOne]);

      const res = await request(app)
        .post('/v1/client')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newClient)
        .expect(httpStatus.CREATED);

      //   expect(res.body).toEqual({
      //     id: expect.anything(),
      //     name: newClient.name,
      //     description: newClient.description,
      //     projectName: newClient.projectName,
      //     dueDate: expect.anything(),
      //     stack: newClient.stack,
      //   });

      const dbClient = await Client.findById(res.body.id);
      expect(dbClient).toBeDefined();
      // expect(dbClient).toMatchObject({ title: newClient.title, category: newClient.category, description: newClient.description, link: newClient.link, gallery: newClient.gallery });
      expect(dbClient.name).toBe(newClient.name);
      expect(dbClient.description).toBe(newClient.description);
      expect(dbClient.projectName).toBe(newClient.projectName);
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/client').send(newClient).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if logged in user is not admin', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/v1/client')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newClient)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('GET /v1/client', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertClients([clientOne, clientTwo, clientThree]);

      const res = await request(app)
        .get('/v1/client')
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
      //   expect(res.body.results[0]).toEqual({
      //     id: clientOne._id.toHexString(),
      //     name: clientOne.name,
      //     description: clientOne.description,
      //     projectName: clientOne.projectName,
      //     dueDate: clientOne.dueDate,
      //     stack: clientOne.stack,
      //   });
      expect(res.body.results[0].id).toBe(clientOne._id.toHexString());
    });

    test('should return 401 if access token is missing', async () => {
      await insertClients([clientOne, clientTwo, clientThree]);

      await request(app).get('/v1/client').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin or non-client is trying to access all items', async () => {
      await insertUsers([userOne]);
      await insertClients([clientOne, clientTwo, clientThree]);

      await request(app)
        .get('/v1/client')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should correctly apply filter on name field', async () => {
      await insertUsers([admin]);
      await insertClients([clientOne, clientTwo, clientThree]);

      const res = await request(app)
        .get('/v1/client')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ name: clientOne.name })
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
      expect(res.body.results[0].id).toBe(clientOne._id.toHexString());
    });

    test('should correctly apply filter on projectName field', async () => {
      await insertUsers([admin]);
      await insertClients([clientOne, clientTwo, clientThree]);

      const res = await request(app)
        .get('/v1/client')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ projectName: clientOne.projectName })
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
      expect(res.body.results[0].id).toBe(clientOne._id.toHexString());
    });

    test('should correctly apply filter on stack field', async () => {
      await insertUsers([admin]);
      await insertClients([clientOne, clientTwo, clientThree]);

      const res = await request(app)
        .get('/v1/client')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ stack: clientOne.stack })
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
      expect(res.body.results[0].id).toBe(clientOne._id.toHexString());
    });

    test('should correctly apply filter on dueDate field', async () => {
      await insertUsers([admin]);
      await insertClients([clientOne, clientTwo, clientThree]);

      const res = await request(app)
        .get('/v1/client')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ dueDate: clientOne.dueDate })
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
      expect(res.body.results[0].id).toBe(clientOne._id.toHexString());
    });

    test('should correctly sort returned array if descending sort param is specified', async () => {
      await insertUsers([admin]);
      await insertClients([clientOne, clientTwo, clientThree]);

      const res = await request(app)
        .get('/v1/client')
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
      expect(res.body.results[0].id).toBe(clientOne._id.toHexString());
      expect(res.body.results[1].id).toBe(clientTwo._id.toHexString());
      expect(res.body.results[2].id).toBe(clientThree._id.toHexString());
    });

    test('should correctly sort returned array if ascending sort param is specified', async () => {
      await insertUsers([admin]);
      await insertClients([clientOne, clientTwo, clientThree]);

      const res = await request(app)
        .get('/v1/client')
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
      expect(res.body.results[0].id).toBe(clientOne._id.toHexString());
      expect(res.body.results[1].id).toBe(clientTwo._id.toHexString());
      expect(res.body.results[2].id).toBe(clientThree._id.toHexString());
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertUsers([admin]);
      await insertClients([clientOne, clientTwo, clientThree]);

      const res = await request(app)
        .get('/v1/client')
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
      expect(res.body.results[0].id).toBe(clientOne._id.toHexString());
      expect(res.body.results[1].id).toBe(clientTwo._id.toHexString());
    });

    test('should return the correct page if page and limit params are specified', async () => {
      await insertUsers([admin]);
      await insertClients([clientOne, clientTwo, clientThree]);

      const res = await request(app)
        .get('/v1/client')
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
      expect(res.body.results[0].id).toBe(clientThree._id.toHexString());
    });
  });

  describe('GET /v1/client/:clientId', () => {
    test('should return 200 and the client object if data is ok', async () => {
      await insertUsers([admin]);
      await insertClients([clientOne]);

      const res = await request(app)
        .get(`/v1/client/${clientOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      //   expect(res.body).toEqual({
      //     id: clientOne._id.toHexString(),
      //     name: clientOne.name,
      //     description: clientOne.description,
      //     projectName: clientOne.projectName,
      //     dueDate: clientOne.dueDate,
      //     stack: clientOne.stack,
      //   });
      expect(res.body.id).toBe(clientOne._id.toHexString());
    });

    test('should return 401 error if access token is missing', async () => {
      await insertClients([clientOne]);

      await request(app).get(`/v1/client/${clientOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    // getting someone else's items

    test('should return 400 error if clientId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertClients([clientOne]);

      await request(app)
        .get('/v1/client/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if client is not found', async () => {
      await insertUsers([admin]);
      await insertClients([clientOne]);

      await request(app)
        .get(`/v1/client/${clientTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/client/:clientId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([admin]);
      await insertClients([clientOne]);

      await request(app)
        .delete(`/v1/client/${clientOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbClient = await Client.findById(clientOne._id);
      expect(dbClient).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);

      await request(app).delete(`/v1/client/${clientOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    // User trying to delete someone else's items

    // admin trying to delete someone else's items

    // User assigning someone else item

    test('should return 400 error if clientId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertClients([clientOne]);

      await request(app)
        .delete('/v1/client/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if client is not found', async () => {
      await insertUsers([admin]);
      await insertClients([clientOne]);

      await request(app)
        .delete(`/v1/client/${clientTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/client/:clientId', () => {
    test('should return 200 and successfully update client if data is ok', async () => {
      await insertUsers([admin]);
      await insertClients([clientOne]);
      const updateBody = {
        name: faker.lorem.word(),
        description: faker.lorem.sentence(5),
        projectName: faker.lorem.sentence(3),
        dueDate: faker.date.future(2),
        stack: [faker.lorem.word(), faker.lorem.word()],
      };

      const res = await request(app)
        .patch(`/v1/client/${clientOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      //   expect(res.body).toEqual({
      //     id: clientOne._id.toHexString(),
      //     name: updateBody.name,
      //     description: updateBody.description,
      //     projectName: updateBody.projectName,
      //     dueDate: updateBody.dueDate,
      //     stack: updateBody.stack,
      //   });
      expect(res.body.id).toBe(clientOne._id.toHexString());

      const dbClient = await Client.findById(clientOne._id);
      expect(dbClient).toBeDefined();
      // expect(dbClient).toMatchObject({ title: updateBody.title, category: updateBody.category, description: updateBody.description, link: updateBody.link, gallery: updateBody.gallery });
      expect(dbClient.name).toBe(updateBody.name);
      expect(dbClient.description).toBe(updateBody.description);
      expect(dbClient.projectName).toBe(updateBody.projectName);
    });

    test('should return 401 error if access token is missing', async () => {
      await insertClients([clientOne]);
      const updateBody = { title: faker.lorem.sentence(5) };

      await request(app).patch(`/v1/client/${clientOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    // user updating another user's items

    // admin updating another user's items

    test('should return 404 if admin is updating cient that does not exist', async () => {
      await insertUsers([admin]);
      await insertClients([clientOne]);
      const updateBody = { projectName: faker.lorem.sentence(5) };

      await request(app)
        .patch(`/v1/client/${clientTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if clientId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertClients([clientOne]);
      const updateBody = { title: faker.lorem.sentence(5) };

      await request(app)
        .patch(`/v1/client/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
