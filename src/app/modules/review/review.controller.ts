import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { ReviewRating } from '@prisma/client';
import { ReviewService } from './review.service';

// create review
const createReview = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await ReviewService.createReview(data);

  sendResponse<ReviewRating>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Review and Rating Created Successfully',
    data: result,
  });
});

// delete review
const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = req.user;

  const result = await ReviewService.deleteReview(id, user?.id);

  sendResponse<ReviewRating>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review and Rating Deleted successfully',
    data: result,
  });
});

export const ReviewController = {
  createReview,
  deleteReview,
};
