import httpStatus from 'http-status';

import { AuthsServices } from './auth.service';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../utils/sendResponse';

const registerOrLoginUser = catchAsync(async (req, res) => {
  const result = await AuthsServices.registerOrLoginUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created or retrieved successfully',
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthsServices.loginUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: result,
  });
});

export const AuthsControllers = { registerOrLoginUser, loginUser };
