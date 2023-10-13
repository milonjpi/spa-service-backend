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
router.get('/', auth(ENUM_USER_ROLE.ADMIN), FeedbackController.getAllFeedbacks);

// get feedbacks for public
router.get('/public-feedback', FeedbackController.getFeedbacksForPublic);

export const FeedbackRoutes = router;
