const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { portfolioValidation } = require('../../validations');
const { portfolioController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('managePortfolio'), validate(portfolioValidation.createItem), portfolioController.createItem)
  .get(auth('getPortfolio'), validate(portfolioValidation.queryPortfolio), portfolioController.queryPortfolio);

router
  .route('/:taskId')
  .get(auth('getPortfolio'), validate(portfolioValidation.getItem), portfolioController.getItem)
  .patch(auth('mmanagePortfolio'), validate(portfolioValidation.updateItem), portfolioController.updateItem)
  .delete(auth('managePortfolio'), validate(portfolioValidation.deleteItem), portfolioController.deleteItem);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Portfolio
 *   description: Portfolio item management and retrieval
 */

/**
 * @swagger
 * path:
 *  /portfolio:
 *    post:
 *      summary: Create a portfolio item
 *      description: Only admins can create portfolio items.
 *      tags: [Portfolio]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - title
 *                - category
 *                - description
 *                - price
 *                - difficulty
 *              properties:
 *                title:
 *                  type: string
 *                category:
 *                  type: string
 *                description:
 *                  type: string
 *                link:
 *                  type: string
 *                gallery:
 *                  type: array
 *              example:
 *                title: E-commerce frontend
 *                category: E-commerce
 *                description: E-commerce frontend blah blah blah
 *                link: http://asampleportfolio.com
 *                gallery: [http://img1.com, http://img2.com]
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Portfolio'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *
 *    get:
 *      summary: Get all Portfolio items
 *      description: All users can retrieve portfolio items.
 *      tags: [Portfolio]
 *      parameters:
 *        - in: query
 *          category: category
 *          schema:
 *            type: string
 *          description: Category
 *        - in: query
 *          name: sortBy
 *          schema:
 *            type: string
 *          description: sort by query in the form of field:desc/asc (ex. name:asc)
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *            minimum: 1
 *          default: 10
 *          description: Maximum number of items
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *            minimum: 1
 *            default: 1
 *          description: Page number
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  results:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Portfolio'
 *                  page:
 *                    type: integer
 *                    example: 1
 *                  limit:
 *                    type: integer
 *                    example: 10
 *                  totalPages:
 *                    type: integer
 *                    example: 1
 *                  totalResults:
 *                    type: integer
 *                    example: 1
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * path:
 *  /portfolio/{id}:
 *    get:
 *      summary: Get a portfolio item
 *      description: All users can retrieve portfolio items.
 *      tags: [Portfolio]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Portfolio item id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Portfolio'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    patch:
 *      summary: Update a portfolio item
 *      description: Only admins can update portfolio items.
 *      tags: [Portfolio]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Portfolio item id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                category:
 *                  type: string
 *                description:
 *                  type: string
 *                link:
 *                  type: string
 *                gallery:
 *                  type: array
 *              example:
 *                title: E-commerce frontend
 *                category: E-commerce
 *                description: E-commerce frontend blah blah blah
 *                link: http://asampleportfolio.com
 *                gallery: [http://img1.com, http://img2.com]
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Portfolio'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    delete:
 *      summary: Delete a portfolio item
 *      description: Only admins can delete portfolio items.
 *      tags: [Portfolio]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Portfolio item id
 *      responses:
 *        "200":
 *          description: No content
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */