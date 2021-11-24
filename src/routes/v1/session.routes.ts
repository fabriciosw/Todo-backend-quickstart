import { Router } from 'express';
import {
  createUserSessionHandler,
  getUserSessionsHandler,
  deleteSessionHandler,
} from '../../controllers/session.controller';
import { createSessionSchema } from '../../schemas/session.schema';
import requireUser from '../../middlewares/requireUser';
import validateResource from '../../middlewares/validateResource';

const routes = Router();

/**
 * @openapi
 * /api/v1/sessions:
 *  post:
 *     summary: Create a session
 *     description: Authenticates the user and returns a valid token
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSessionInput'
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/CreateSessionResponse'
 *  get:
 *     summary: List sessions
 *     description: List sessions
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/ListSessionResponse'
 *
 *  delete:
 *     summary: Delete a session
 *     description: Delete a session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "204":
 *         description: No content
 */

routes
  .route('/')
  .post(validateResource(createSessionSchema), createUserSessionHandler)
  .get(requireUser, getUserSessionsHandler)
  .delete(requireUser, deleteSessionHandler);

export default routes;
