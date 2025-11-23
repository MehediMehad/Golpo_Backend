import httpStatus from 'http-status';

import { UsersServices } from './users.service';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../utils/sendResponse';

const registerOrLoginUser = catchAsync(async (req, res) => {
  const result = await UsersServices.registerOrLoginUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created or retrieved successfully',
    data: result,
  });
});

export const UsersControllers = { registerOrLoginUser };
