import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Feedback, Prisma } from '@prisma/client';
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
  filters: IFeedbackFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Feedback[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

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
    include: {
      user: true,
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
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
    include: {
      user: true,
    },
    take: 10,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return result;
};

export const FeedbackService = {
  createFeedback,
  getAllFeedbacks,
  getFeedbacksForPublic,
};
