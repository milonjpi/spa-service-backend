import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Feedback, Prisma, User, UserRole } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IFeedbackFilters } from './feedback.interface';
import { feedbackSearchableFields } from './feedback.constant';

// create feedback
const createFeedback = async (data: Feedback): Promise<Feedback | null> => {
  const result = await prisma.feedback.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create Feedback');
  }

  return result;
};

// get all feedbacks
const getAllFeedbacks = async (
  user: Pick<User, 'id' | 'role'>,
  filters: IFeedbackFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Feedback[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (user.role === UserRole.user) {
    andConditions.push({
      userId: user.id,
    });
  }

  if (searchTerm) {
    andConditions.push({
      OR: feedbackSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions: Prisma.FeedbackWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.feedback.findMany({
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      user: true,
    },
  });

  const total = await prisma.feedback.count({
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

const getFeedbacksForPublic = async (): Promise<Feedback[]> => {
  const result = await prisma.feedback.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
    include: {
      user: true,
    },
  });

  return result;
};

// delete Feedback
const deleteFeedback = async (
  id: string,
  user: Pick<User, 'id' | 'role'>
): Promise<Feedback | null> => {
  // check is exist
  const isExist = await prisma.feedback.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Feedback Not Found');
  }

  if (user.id !== isExist.userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not Authorized!!');
  }

  const result = await prisma.feedback.delete({
    where: {
      id,
    },
  });

  return result;
};

export const FeedbackService = {
  createFeedback,
  getAllFeedbacks,
  getFeedbacksForPublic,
  deleteFeedback,
};
