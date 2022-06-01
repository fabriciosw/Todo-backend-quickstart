import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import TasksController from '../../controllers/TasksController';
import isAuthenticated from '../../middlewares/UserAuthenticated';

const tasksRouter = Router();
const TaskController = new TasksController();

tasksRouter.get('/', isAuthenticated, TaskController.getAll);

tasksRouter.post(
  '/',
  isAuthenticated,
  celebrate({
    [Segments.BODY]: {
      title: Joi.string().required(),
      description: Joi.string().required(),
    },
  }),
  TaskController.create
);

tasksRouter.put(
  '/:id',
  isAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
  }),
  TaskController.endTask
);

tasksRouter.delete(
  '/:id',
  isAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
  }),
  TaskController.delete
);

export default tasksRouter;
