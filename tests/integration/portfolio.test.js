const request = require('supertest');
const mongoose = require('mongoose');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { User } = require('../../src/models');
const { Portfolio } = require('../../src/models');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const { itemOne, itemTwo, itemThree, insertItems } = require('../fixtures/portfolio.fixture');

setupTestDB();

describe('Portfolio routes', () => {
  describe('POST /v1/portfolio', () => {
    let newItem;

    beforeEach(() => {
      newItem = {
        title: faker.lorem.sentence(5),
        category: 'react',
        description: faker.lorem.paragraph(),
        link: faker.internet.url(),
        gallery: [faker.internet.url(), faker.internet.url()]
      };
    });

    test('should return 201 and successfully create new portfolio item if data is ok', async () => {
      await insertUsers([admin]);
      await insertItems([itemOne]);

      const res = await request(app)
        .post('/v1/portfolio')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newItem)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({ id: expect.anything(), title: newItem.title, category: newItem.category, description: newItem.description, link: newItem.link, gallery: newItem.gallery });

      const dbItem = await Portfolio.findById(res.body.id);
      expect(dbItem).toBeDefined();
      expect(dbItem).toMatchObject({ title: newItem.title, category: newItem.category, description: newItem.description, link: newItem.link, gallery: newItem.gallery });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/portfolio').send(newItem).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if logged in user is not admin', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/v1/portfolio')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newItem)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('GET /v1/portfolio', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([userOne, userTwo, admin]);
      await insertItems([itemOne, itemTwo, itemThree]);

      const res = await request(app)
        .get('/v1/portfolio')
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
      expect(res.body.results[0]).toEqual({
        id: itemOne._id.toHexString(),
        title: itemOne.title,
        category: itemOne.category,
        description: itemOne.description,
        link: itemOne.link,
        gallery: itemOne.gallery
      });
    });

    test('should return 401 if access token is missing', async () => {
      await insertItems([itemOne, itemTwo, itemThree]);

      await request(app).get('/v1/portfolio').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin is trying to access all items', async () => {
      await insertUsers([userOne]);
      await insertItems([itemOne, itemTwo, itemThree]);

      await request(app)
        .get('/v1/portfolio')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    test('should correctly apply filter on category field', async () => {
      await insertUsers([admin]);
      await insertItems([itemOne, itemTwo, itemThree]);

      const res = await request(app)
        .get('/v1/portfolio')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .query({ category: itemOne.category })
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
      expect(res.body.results[0].id).toBe(itemOne._id.toHexString());
    });

    test('should correctly sort returned array if descending sort param is specified', async () => {
      await insertUsers([admin]);
      await insertItems([itemOne, itemTwo, itemThree]);

      const res = await request(app)
        .get('/v1/portfolio')
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
      expect(res.body.results[0].id).toBe(itemOne._id.toHexString());
      expect(res.body.results[1].id).toBe(itemTwo._id.toHexString());
      expect(res.body.results[2].id).toBe(itemThree._id.toHexString());
    });

    test('should correctly sort returned array if ascending sort param is specified', async () => {
      await insertUsers([admin]);
      await insertItems([itemOne, itemTwo, itemThree]);

      const res = await request(app)
        .get('/v1/portfolio')
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
      expect(res.body.results[0].id).toBe(itemOne._id.toHexString());
      expect(res.body.results[1].id).toBe(itemTwo._id.toHexString());
      expect(res.body.results[2].id).toBe(itemThree._id.toHexString());
    });

    test('should limit returned array if limit param is specified', async () => {
      await insertUsers([admin]);
      await insertItems([itemOne, itemTwo, itemThree]);

      const res = await request(app)
        .get('/v1/portfolio')
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
      expect(res.body.results[0].id).toBe(itemOne._id.toHexString());
      expect(res.body.results[1].id).toBe(itemTwo._id.toHexString());
    });

    test('should return the correct page if page and limit params are specified', async () => {
      await insertUsers([admin]);
      await insertItems([itemOne, itemTwo, itemThree]);

      const res = await request(app)
        .get('/v1/portfolio')
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
      expect(res.body.results[0].id).toBe(itemThree._id.toHexString());
    });
  });

  describe('GET /v1/portfolio/:itemId', () => {
    test('should return 200 and the item object if data is ok', async () => {
      await insertUsers([admin]);
      await insertItems([itemOne]);

      const res = await request(app)
        .get(`/v1/portfolio/${itemOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: itemOne._id.toHexString(),
        title: itemOne.title,
        category: itemOne.category,
        description: itemOne.description,
        link: itemOne.link,
        gallery: itemOne.gallery
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertItems([itemOne]);

      await request(app).get(`/v1/portfolio/${itemOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    // getting someone else's items

    test('should return 400 error if itemId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertItems([itemOne]);

      await request(app)
        .get('/v1/portfolio/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if item is not found', async () => {
      await insertUsers([admin]);
      await insertItems([itemOne]);

      await request(app)
        .get(`/v1/portfolio/${itemTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/portfolio/:itemId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([admin]);
      await insertItems([itemOne]);

      await request(app)
        .delete(`/v1/portfolio/${itemOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbItem = await item.findById(itemOne._id);
      expect(dbItem).toBeNull();
    });

    test('should return 401 error if access token is missing', async () => {
      await insertUsers([userOne]);

      await request(app).delete(`/v1/portfolio/${itemOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    });

    // User trying to delete someone else's items

    // admin trying to delete someone else's items

    // User assigning someone else item 

    test('should return 400 error if itemId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertItems([itemOne]);

      await request(app)
        .delete('/v1/portfolio/invalidId')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if item is not found', async () => {
      await insertUsers([admin]);
      await insertItems([itemOne]);

      await request(app)
        .delete(`/v1/portfolio/${itemTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/portfolio/:itemId', () => {
    test('should return 200 and successfully update item if data is ok', async () => {
      await insertUsers([admin]);
      await insertItems([itemOne]);
      const updateBody = {
        title: faker.lorem.sentence(5),
        category: 'node',
        description: faker.lorem.paragraph(),
        link: faker.internet.url(),
        gallery: [faker.internet.url(), faker.internet.url(), faker.internet.url()]
      };

      const res = await request(app)
        .patch(`/v1/portfolio/${itemOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: itemOne._id.toHexString(),
        title: updateBody.title,
        category: updateBody.category,
        description: updateBody.description,
        link: updateBody.link,
        gallery: updateBody.gallery
      });

      const dbItem = await item.findById(itemOne._id);
      expect(dbItem).toBeDefined();
      expect(dbItem).toMatchObject({ title: updateBody.title, category: updateBody.category, description: updateBody.description, link: updateBody.link, gallery: updateBody.gallery });
    });

    test('should return 401 error if access token is missing', async () => {
      await insertItems([itemOne]);
      const updateBody = { title: faker.lorem.sentence(5) };

      await request(app).patch(`/v1/portfolio/${itemOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
    });

    // user updating another user's items

    // admin updating another user's items

    test('should return 404 if admin is updating item that is not found', async () => {
      await insertUsers([admin]);
      await insertItems([itemOne]);
      const updateBody = { title: faker.lorem.sentence(5) };

      await request(app)
        .patch(`/v1/portfolio/${itemTwo._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 error if itemId is not a valid mongo id', async () => {
      await insertUsers([admin]);
      await insertItems([itemOne]);
      const updateBody = { title: faker.lorem.sentence(5) };

      await request(app)
        .patch(`/v1/portfolio/invalidId`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
