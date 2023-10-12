import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { ReviewValidation } from './review.validation';
import { ReviewController } from './review.controller';

const router = express.Router();

// create Review and rating
router.post(
  '/create',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(ReviewValidation.create),
  ReviewController.createReview
);

// delete review and rating
router.delete('/:id', auth(ENUM_USER_ROLE.USER), ReviewController.deleteReview);

export const ReviewRoutes = router;
