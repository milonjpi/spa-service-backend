import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { FeedbackValidation } from './feedback.validation';
import { FeedbackController } from './feedback.controller';

const router = express.Router();

// create feedback
router.post(
  '/create',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(FeedbackValidation.create),
  FeedbackController.createFeedback
);

// get all feedbacks
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  FeedbackController.getAllFeedbacks
);

// get feedbacks for public
router.get('/public-feedback', FeedbackController.getFeedbacksForPublic);

// delete Feedback
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  FeedbackController.deleteFeedback
);

export const FeedbackRoutes = router;
