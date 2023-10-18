import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Notification, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { INotificationFilters } from './notification.interface';

// get all notification
const getAllNotifications = async (
  userId: string,
  filters: INotificationFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Notification[]>> => {
  const { viewed } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  andConditions.push({ userId: userId });

  if (viewed) {
    andConditions.push({ viewed: viewed === 'true' ? true : false });
  }

  const whereConditions: Prisma.NotificationWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.notification.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.notification.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};

// mark as viewed
const markAsViewed = async (
  id: string,
  userId: string
): Promise<Notification | null> => {
  // check is exist
  const isExist = await prisma.notification.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification Not Found');
  }

  if (isExist.userId !== userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }

  const result = await prisma.notification.update({
    where: {
      id,
    },
    data: { viewed: true },
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to mark as viewed');
  }

  return result;
};

export const NotificationService = {
  getAllNotifications,
  markAsViewed,
};
