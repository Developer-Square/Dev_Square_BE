const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { projectValidation } = require('../../validations');
const { projectController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('manageProjects'), validate(projectValidation.createProject), projectController.createProject)
  .get(auth('getProjects'), validate(projectValidation.queryProject), projectController.queryProject);

router
  .route('/:projectId')
  .get(auth('getProjects'), validate(projectValidation.getProject), projectController.getProject)
  .patch(auth('manageProjects'), validate(projectValidation.updateProject), projectController.updateProject)
  .delete(auth('manageProjects'), validate(projectValidation.deleteProject), projectController.deleteProject);

router
  .route('/tasks/:projectId')
  .get(auth('getProjects'), validate(projectValidation.getTaskData), projectController.getTaskData);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Project
 *   description: Project item management and retrieval
 */

/**
 * @swagger
 * path:
 *  /project:
 *    post:
 *      summary: Create a project item
 *      description: Only admins can create project items.
 *      tags: [Project]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - clientId
 *                - name
 *                - description
 *                - dueDate
 *                - stack
 *              properties:
 *                clientId:
 *                  type: string
 *                name:
 *                  type: string
 *                description:
 *                  type: string
 *                dueDate:
 *                  type: date
 *                stack:
 *                  type: string
 *                tasks:
 *                  type: array
 *              example:
 *                clientId: 5ebac534954b54139806c112
 *                name: Backend for mobile app
 *                description: Backend for mobile app
 *                dueDate: '2021-05-18T16:00:00Z'
 *                stack: node, mongoDB
 *                tasks: [5ebac534954b54139806c113, 5ebac534954b54139806c114]
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Project'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *
 *    get:
 *      summary: Get all Projects
 *      description: Only admins can retrieve projects.
 *      tags: [Project]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: name
 *          schema:
 *            type: string
 *          description: Project name
 *        - in: query
 *          name: clientId
 *          schema:
 *            type: string
 *          description: Client's Id
 *        - in: query
 *          name: stack
 *          schema:
 *            type: string
 *          description: stack
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
 *          description: Maximum number of projects
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
 *                      $ref: '#/components/schemas/Project'
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
 *  /project/{id}:
 *    get:
 *      summary: Get a project
 *      description: Only admins and clients can retrieve projects.
 *      tags: [Project]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Project id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Project'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    patch:
 *      summary: Update a project
 *      description: Only admins can update projects.
 *      tags: [Project]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Project id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                clientId:
 *                  type: string
 *                name:
 *                  type: string
 *                description:
 *                  type: string
 *                dueDate:
 *                  type: date
 *                stack:
 *                  type: string
 *                tasks:
 *                  type: array
 *              example:
 *                clientId: 5ebac534954b54139806c112
 *                name: Backend for mobile app
 *                description: Backend for mobile app
 *                dueDate: '2021-05-18T16:00:00Z'
 *                stack: node, mongoDB
 *                tasks: [5ebac534954b54139806c113, 5ebac534954b54139806c114]
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Project'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    delete:
 *      summary: Delete a project
 *      description: Only admins can delete projects.
 *      tags: [Project]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Project id
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

/**
 * @swagger
 * path:
 *  /project/tasks/{id}:
 *    get:
 *      summary: Get a project's tasks
 *      description: Only admins and clients can retrieve project tasks.
 *      tags: [Project]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Project id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/ProjectTasks'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */
