import { Router } from 'express';

import { UsersControllers } from './users.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UsersValidations } from './users.validation';

const router = Router();

router.post('/join', validateRequest(UsersValidations.registerOrLoginUserSchema), UsersControllers.registerOrLoginUser);

export const UsersRoutes = router;
