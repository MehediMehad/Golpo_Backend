import { Router } from 'express';

import { UsersControllers } from './users.controller';
import { UsersValidations } from './users.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = Router();

router.post(
  '/join',
  validateRequest(UsersValidations.registerOrLoginUserSchema),
  UsersControllers.registerOrLoginUser,
);

export const UsersRoutes = router;
