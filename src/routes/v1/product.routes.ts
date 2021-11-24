import { Router } from 'express';
import {
  createProductHandler,
  getProductHandler,
  updateProductHandler,
  deleteProductHandler,
  getProductsHandler,
} from '../../controllers/product.controller';
import requireUser from '../../middlewares/requireUser';
import validateResource from '../../middlewares/validateResource';

import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  updateProductSchema,
} from '../../schemas/product.schema';

const routes = Router();

/**
 * @openapi
 * '/api/products/{productId}':
 *  get:
 *     tags:
 *     - Products
 *     summary: Get a single product by the productId
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - name: productId
 *        in: path
 *        description: The id of the product
 *        required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */

routes
  .route('/')
  .get(getProductsHandler)
  .post(
    [requireUser, validateResource(createProductSchema)],
    createProductHandler
  );

routes
  .route('/:productId')
  .get(validateResource(getProductSchema), getProductHandler)
  .put(
    [requireUser, validateResource(updateProductSchema)],
    updateProductHandler
  )
  .delete(
    [requireUser, validateResource(deleteProductSchema)],
    deleteProductHandler
  );

export default routes;
