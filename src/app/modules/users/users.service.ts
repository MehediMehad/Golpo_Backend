import type { TAuthPayload } from '../../helpers/jwtHelpers';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import prisma from '../../libs/prisma';
import { TRegisterOrLoginUserPayload } from './user.interface';

const registerOrLoginUser = async (payload: TRegisterOrLoginUserPayload) => {
  const { email, name, image, provider, providerId } = payload;

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

export const UsersServices = {
  registerOrLoginUser,
};
