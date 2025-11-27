import type { TRegisterOrLoginUserPayload } from './auth.interface';
import type { TAuthPayload } from '../../helpers/jwtHelpers';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import prisma from '../../libs/prisma';
import bcrypt from 'bcrypt';
import config from '../../configs';

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

const loginUser = async (payload: TRegisterOrLoginUserPayload) => {

};

export const AuthsServices = {
  registerOrLoginUser,
  loginUser,
};
