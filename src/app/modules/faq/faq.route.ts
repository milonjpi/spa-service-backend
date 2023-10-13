import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { FaqValidation } from './faq.validation';
import { FaqController } from './faq.controller';

const router = express.Router();

// create FAQ
router.post(
  '/create',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(FaqValidation.create),
  FaqController.createFaq
);

// get all FAQs
router.get('/', FaqController.getAllFaqs);

// update FAQ
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(FaqValidation.update),
  FaqController.updateFaq
);

// delete FAQ
router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), FaqController.deleteFaq);

export const FaqRoutes = router;
