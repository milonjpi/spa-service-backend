import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import prisma from '../../../shared/prisma';
import { User } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import config from '../../../config';

// get profile
const getProfile = async (id: string): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  return result;
};

// update profile
const updateProfile = async (
  id: string,
  payload: Partial<User>
): Promise<User | null> => {
  // check is exist
  const isExist = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  // hashing password
  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(config.bcrypt_salt_rounds)
    );
  }

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update Profile');
  }

  return result;
};

export const ProfileService = {
  getProfile,
  updateProfile,
};
