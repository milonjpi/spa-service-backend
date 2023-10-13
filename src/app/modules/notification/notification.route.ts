import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { NotificationController } from './notification.controller';

const router = express.Router();

// get all notification by user ID
router.get(
  '/',
  auth(ENUM_USER_ROLE.USER),
  NotificationController.getAllNotifications
);

// mark as viewed notification
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.USER),
  NotificationController.markAsViewed
);

export const NotificationRoutes = router;
