import { object, string, InferType } from 'yup';

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateSessionInput:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *        password:
 *          type: string
 *    CreateSessionResponse:
 *      type: object
 *      properties:
 *        accessToken:
 *          type: string
 *        refreshToken:
 *          type: string
 *    ListSessionResponse:
 *      type: array
 *      items:
 *        type: object
 *        properties:
 *          user:
 *            type: string
 *          valid:
 *            type: boolean
 */

export const createSessionSchema = object({
  body: object({
    email: string().required('Email is required'),
    password: string().required('Password is required'),
  }),
});

export type CreateSessionInput = InferType<typeof createSessionSchema>;
