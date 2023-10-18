import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import {
  Booking,
  BookingStatus,
  Prisma,
  ServiceStatus,
  User,
  UserRole,
} from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IBookingFilters } from './booking.interface';
import { generateBookingNo } from './booking.utils';

// create booking
const createBooking = async (data: Booking): Promise<Booking | null> => {
  const isExist = await prisma.service.findFirst({
    where: { id: data?.serviceId, status: ServiceStatus.available },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This service not available');
  }
  const result = await prisma.$transaction(async trans => {
    // generate booking no
    const bookingNo = await generateBookingNo();
    data.bookingNo = bookingNo;
    const creating = await trans.booking.create({ data });

    await trans.notification.create({
      data: {
        userId: creating.userId,
        notification: `You place a service booking. your booking no is ${creating.bookingNo}.`,
      },
    });

    return creating;
  });

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
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
    include: {
      user: true,
      service: true,
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

  const result = await prisma.$transaction(async trans => {
    const confirming = await prisma.booking.update({
      where: {
        id,
      },
      data: {
        scheduleTime: payload.scheduleTime,
        status: BookingStatus.confirmed,
      },
    });

    await trans.notification.create({
      data: {
        userId: confirming.userId,
        notification: `You booking no ${confirming.bookingNo} has been confirmed.`,
      },
    });

    return confirming;
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

  const result = await prisma.$transaction(async trans => {
    const canceling = await prisma.booking.update({
      where: {
        id,
      },
      data: {
        status: BookingStatus.canceled,
      },
    });

    await trans.notification.create({
      data: {
        userId: canceling.userId,
        notification: `You booking no ${canceling.bookingNo} has been canceled.`,
      },
    });

    return canceling;
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Cancel Booking');
  }

  return result;
};

// complete service
const completeService = async (id: string): Promise<Booking | null> => {
  // check is exist
  const isExist = await prisma.booking.findUnique({
    where: {
      id,
      status: { equals: BookingStatus.confirmed },
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking Not Found to Complete');
  }

  const result = await prisma.$transaction(async trans => {
    const completing = await prisma.booking.update({
      where: {
        id,
      },
      data: {
        status: BookingStatus.completed,
      },
    });

    await trans.notification.create({
      data: {
        userId: completing.userId,
        notification: `You booking no ${completing.bookingNo} has been confirmed.`,
      },
    });

    return completing;
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Complete Booking');
  }

  return result;
};

export const BookingService = {
  createBooking,
  getAllBookings,
  confirmBooking,
  cancelBooking,
  completeService,
};
