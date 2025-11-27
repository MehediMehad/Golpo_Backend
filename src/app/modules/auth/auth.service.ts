import type { TLoginUserPayload, TRegisterOrLoginUserPayload } from './auth.interface';
import type { TAuthPayload } from '../../helpers/jwtHelpers';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import prisma from '../../libs/prisma';
import bcrypt from 'bcrypt';
import config from '../../configs';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';

const registerOrLoginUser = async (payload: TRegisterOrLoginUserPayload) => {
  const { email, name, image, provider, providerId, password } = payload;

  if (password) {
    const hashedPassword = await bcrypt.hash(password, config.auth.bcrypt_salt_rounds);
    payload.password = hashedPassword;
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const createdUser = await prisma.user.create({
      data: {
        email,
        name,
        image,
        provider,
        providerId,
        password: payload.password || undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        provider: true,
        providerId: true,
        role: true,
      },
    });

    const data: TAuthPayload = {
      userId: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
    };

    // Generate an access token
    const { accessToken, refreshToken } = jwtHelpers.generateAuthTokens(data);

    return { ...createdUser, accessToken, refreshToken };
  }

  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      name,
      image,
      provider,
      providerId,
      password: payload.password || user.password || undefined,
    },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      provider: true,
      providerId: true,
      role: true,
    },
  });

  const data: TAuthPayload = {
    userId: updatedUser.id,
    email: updatedUser.email,
    role: updatedUser.role,
  };

  // Generate an access token
  const { accessToken, refreshToken } = jwtHelpers.generateAuthTokens(data);

  return { ...updatedUser, accessToken, refreshToken };
};

const loginUser = async (payload: TLoginUserPayload) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true, image: true, role: true, password: true, status: true }
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  if (user.status === 'BLOCKED') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Your account is blocked!');
  }

  if (!user.password) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You have not set a password yet! try social login!');
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password!');
  }

  const data: TAuthPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  // Generate an access token
  const { accessToken, refreshToken } = jwtHelpers.generateAuthTokens(data);

  const { password: _, ...rest } = user
  return { ...rest, accessToken, refreshToken };

};

export const AuthsServices = {
  registerOrLoginUser,
  loginUser,
};
