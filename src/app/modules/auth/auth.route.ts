import { Router } from 'express';

import { AuthsControllers } from './auth.controller';
import { AuthsValidations } from './auth.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = Router();

router.post(
  '/login',
  validateRequest(AuthsValidations.loginSchema),
  AuthsControllers.loginUser,
);
router.post(
  '/signup',
  validateRequest(AuthsValidations.registerOrLoginUserSchema),
  AuthsControllers.registerOrLoginUser,
);

export const AuthsRoutes = router;
