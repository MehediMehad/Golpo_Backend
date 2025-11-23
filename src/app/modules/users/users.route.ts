import { Router } from 'express';

import { UsersControllers } from './users.controller';

const router = Router();

router.post('/', UsersControllers.registerOrLoginUser);

export const UsersRoutes = router;
