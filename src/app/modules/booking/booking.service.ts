import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Booking, BookingStatus, Prisma, User, UserRole } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IBookingFilters } from './booking.interface';

// create booking
const createBooking = async (data: Booking): Promise<Booking | null> => {
  const result = await prisma.booking.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create booking');
  }

  return result;
};

// get all bookings
const getAllBookings = async (
  filters: IBookingFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Booking[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (Object.keys(filters).length > 0) {
    andConditions.push({
      AND: Object.entries(filters).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions: Prisma.BookingWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.booking.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.booking.count({
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

// confirm booking
const confirmBooking = async (
  id: string,
  payload: Pick<Booking, 'scheduleTime'>
): Promise<Booking | null> => {
  // check is exist
  const isExist = await prisma.booking.findUnique({
    where: {
      id,
      status: { equals: BookingStatus.pending },
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking Not Found to confirm');
  }

  const result = await prisma.booking.update({
    where: {
      id,
    },
    data: {
      scheduleTime: payload.scheduleTime,
      status: BookingStatus.confirmed,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Confirm Booking');
  }

  return result;
};

// cancel booking
const cancelBooking = async (
  id: string,
  user: Pick<User, 'id' | 'role'>
): Promise<Booking | null> => {
  // check is exist
  const isExist = await prisma.booking.findUnique({
    where: {
      id,
      status: { in: ['pending', 'confirmed'] },
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking Not Found to reject');
  }

  if (user.role === UserRole.user && user.id !== isExist.userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }

  const result = await prisma.booking.update({
    where: {
      id,
    },
    data: {
      status: BookingStatus.canceled,
    },
  });

  return result;
};

export const BookingService = {
  createBooking,
  getAllBookings,
  confirmBooking,
  cancelBooking,
};
