import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Booking, User } from '@prisma/client';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { BookingService } from './booking.service';
import { bookingFilterableFields } from './booking.constant';

// create booking
const createBooking = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await BookingService.createBooking(data);

  sendResponse<Booking>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Booking Created Successfully',
    data: result,
  });
});

// get all bookings
const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, bookingFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await BookingService.getAllBookings(
    filters,
    paginationOptions
  );

  sendResponse<Booking[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bookings retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// confirm booking
const confirmBooking = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await BookingService.confirmBooking(id, data);

  sendResponse<Booking>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Booking Confirmed Successfully',
    data: result,
  });
});

// cancel booking
const cancelBooking = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = req.user as Pick<User, 'id' | 'role'>;

  const result = await BookingService.cancelBooking(id, user);

  sendResponse<Booking>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking Rejected successfully',
    data: result,
  });
});

export const BookingController = {
  createBooking,
  getAllBookings,
  confirmBooking,
  cancelBooking,
};
