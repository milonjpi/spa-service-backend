import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Notification, User } from '@prisma/client';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { NotificationService } from './notification.service';
import { notificationFilterableFields } from './notification.constant';

// get all notifications
const getAllNotifications = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, notificationFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const user = req.user as Pick<User, 'id' | 'role'>;

  const result = await NotificationService.getAllNotifications(
    user.id,
    filters,
    paginationOptions
  );

  sendResponse<Notification[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// mark as viewed notification
const markAsViewed = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = req.user as Pick<User, 'id' | 'role'>;

  const result = await NotificationService.markAsViewed(id, user.id);

  sendResponse<Notification>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Mark as Viewed Successfully',
    data: result,
  });
});

export const NotificationController = {
  getAllNotifications,
  markAsViewed,
};
