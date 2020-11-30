const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { clientValidation } = require('../../validations');
const { clientController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('manageClient'), validate(clientValidation.createItem), clientController.createClient)
  .get(auth('getClient'), validate(clientValidation.queryClient), clientController.queryClient);

router
  .route('/:clientId')
  .get(auth('getClient'), validate(clientValidation.getClient), clientController.getClient)
  .patch(auth('manageClient'), validate(clientValidation.updateClient), clientController.updateClient)
  .delete(auth('manageClient'), validate(clientValidation.deleteClient), clientController.deleteClient);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Client
 *   description: Client item management and retrieval
 */

/**
 * @swagger
 * path:
 *  /client:
 *    post:
 *      summary: Create a client item
 *      description: Only admins can create client items.
 *      tags: [Client]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - name
 *                - description
 *                - projectName
 *                - dueDate
 *                - stack
 *              properties:
 *                name:
 *                  type: string
 *                description:
 *                  type: string
 *                projectName:
 *                  type: string
 *                dueDate:
 *                  type: date
 *                stack:
 *                  type: array
 *              example:
 *                name: RylaTech
 *                description: Backend for mobile app
 *                projectName: Node BE for Mobile app
 *                dueDate: '2021-05-18T16:00:00Z'
 *                stack: [node, mongoDB]
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Client'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *
 *    get:
 *      summary: Get all Clients
 *      description: Only admins can retrieve clients.
 *      tags: [Client]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: name
 *          schema:
 *            type: string
 *          description: name
 *        - in: query
 *          name: projectName
 *          schema:
 *            type: string
 *          description: projectName
 *        - in: query
 *          name: stack
 *          schema:
 *            type: string
 *          description: stack
 *        - in: query
 *          name: dueDate
 *          schema:
 *            type: string
 *          description: dueDate
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
 *                      $ref: '#/components/schemas/Client'
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
 *  /client/{id}:
 *    get:
 *      summary: Get a client
 *      description: Only admins and clients can retrieve clients.
 *      tags: [Client]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Client id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Client'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    patch:
 *      summary: Update a client
 *      description: Only admins can update clients.
 *      tags: [Client]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Client id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                description:
 *                  type: string
 *                projectName:
 *                  type: string
 *                dueDate:
 *                  type: date
 *                stack:
 *                  type: array
 *              example:
 *                name: RylaTech
 *                description: Backend for mobile app
 *                projectName: Node BE for Mobile app
 *                dueDate: '2021-05-18T16:00:00Z'
 *                stack: [node, mongoDB]
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Client'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    delete:
 *      summary: Delete a client
 *      description: Only admins can delete clients.
 *      tags: [Client]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: client id
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
