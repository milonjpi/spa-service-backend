import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { BookingValidation } from './booking.validation';
import { BookingController } from './booking.controller';

const router = express.Router();

// create booking
router.post(
  '/create',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(BookingValidation.create),
  BookingController.createBooking
);

// get all bookings
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  BookingController.getAllBookings
);

// confirm booking
router.patch(
  '/:id/confirm',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(BookingValidation.confirm),
  BookingController.confirmBooking
);

// cancel booking
router.patch(
  '/:id/cancel',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  BookingController.cancelBooking
);

// complete service
router.patch(
  '/:id/complete',
  auth(ENUM_USER_ROLE.ADMIN),
  BookingController.completeService
);

export const BookingRoutes = router;
