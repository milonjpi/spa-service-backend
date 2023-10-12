import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { ReviewRating } from '@prisma/client';
import ApiError from '../../../errors/ApiError';

// create review
const createReview = async (
  data: ReviewRating
): Promise<ReviewRating | null> => {
  if (![1, 2, 3, 4, 5].includes(data?.rating)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Rating must be 1 to 5');
  }

  const result = await prisma.reviewRating.create({ data });

  if (!result) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Failed to create Review and Rating'
    );
  }

  return result;
};

// delete review
const deleteReview = async (
  id: string,
  userId: string
): Promise<ReviewRating | null> => {
  // check is exist
  const isExist = await prisma.reviewRating.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service Not Found');
  }

  if (isExist?.userId !== userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }

  const result = await prisma.reviewRating.delete({
    where: {
      id,
    },
  });

  return result;
};

export const ReviewService = {
  createReview,
  deleteReview,
};
