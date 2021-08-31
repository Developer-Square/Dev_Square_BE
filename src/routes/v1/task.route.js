const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { taskValidation } = require('../../validations');
const { taskController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('manageTasks'), validate(taskValidation.createTask), taskController.createTask)
  .get(auth('getTasks'), validate(taskValidation.queryTasks), taskController.queryTasks);

router
  .route('/:taskId')
  .get(auth('getTasks'), validate(taskValidation.getTask), taskController.getTask)
  .patch(auth('manageTasks'), validate(taskValidation.updateTask), taskController.updateTask)
  .delete(auth('manageTasks'), validate(taskValidation.deleteTask), taskController.deleteTask);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management and retrieval
 */

/**
 * @swagger
 * path:
 *  /tasks:
 *    post:
 *      summary: Create a task
 *      description: Only admins can create tasks.
 *      tags: [Tasks]
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
 *                - creator
 *                - description
 *                - dueDate
 *                - project
 *              properties:
 *                title:
 *                  type: string
 *                creator:
 *                  type: string
 *                description:
 *                  type: string
 *                dueDate:
 *                  type: date
 *                project:
 *                  type: string
 *              example:
 *                title: Node project task one
 *                creator: 5ebac534954b54139806c112
 *                description: E-commerce frontend blah blah blah
 *                dueDate: '2021-05-18T16:00:00Z'
 *                project: 6ebac534954b54139806c112
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Task'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *
 *    get:
 *      summary: Get all tasks
 *      description: Admins and clients can retrieve tasks.
 *      tags: [Tasks]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: project
 *          schema:
 *            type: string
 *          description: Project that the task belongs to
 *        - in: query
 *          name: creator
 *          schema:
 *            type: string
 *          description: The user who created the task
 *        - in: query
 *          name: title
 *          schema:
 *            type: string
 *          description: The title of the task
 *        - in: query
 *          name: status
 *          schema:
 *            type: string
 *          description: Task status
 *        - in: query
 *          name: sortBy
 *          schema:
 *            type: string
 *          description: sort by query in the form of field:desc/asc (ex. creator:asc)
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *            minimum: 1
 *          default: 10
 *          description: Maximum number of tasks
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
 *                      $ref: '#/components/schemas/Task'
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
 *  /tasks/{id}:
 *    get:
 *      summary: Get a task
 *      description: Logged in users can fetch only their tasks. Only admins can fetch other users' tasks.
 *      tags: [Tasks]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Task id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Task'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    patch:
 *      summary: Update a task
 *      description: Only admins can update tasks
 *      tags: [Tasks]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Task id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                project:
 *                  type: string
 *                creator:
 *                  type: string
 *                description:
 *                  type: string
 *                dueDate:
 *                  type: date
 *                title:
 *                  type: string
 *                status:
 *                  type: string
 *                  enum: [notStarted, inProgress, onHold, cancelled, completed]
 *              example:
 *                title: Node project task one
 *                creator: 5ebac534954b54139806c112
 *                description: E-commerce frontend blah blah blah
 *                dueDate: '2021-05-18T16:00:00Z'
 *                project: 8ebac534954b54139806c112
 *                status: inProgress
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Task'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    delete:
 *      summary: Delete a task
 *      description: Only admins can delete tasks
 *      tags: [Tasks]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Task id
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
