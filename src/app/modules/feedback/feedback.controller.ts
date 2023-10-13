import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Feedback } from '@prisma/client';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { FeedbackService } from './feedback.service';
import { feedbackFilterableFields } from './feedback.constant';

// create feedback
const createFeedback = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await FeedbackService.createFeedback(data);

  sendResponse<Feedback>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Feedback Created Successfully',
    data: result,
  });
});

// get all feedbacks
const getAllFeedbacks = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, feedbackFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await FeedbackService.getAllFeedbacks(
    filters,
    paginationOptions
  );

  sendResponse<Feedback[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Feedbacks retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get feedbacks for public
const getFeedbacksForPublic = catchAsync(
  async (req: Request, res: Response) => {
    const result = await FeedbackService.getFeedbacksForPublic();

    sendResponse<Feedback[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Feedbacks retrieved successfully',
      data: result,
    });
  }
);

export const FeedbackController = {
  createFeedback,
  getAllFeedbacks,
  getFeedbacksForPublic,
};
