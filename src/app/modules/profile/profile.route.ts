import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { ProfileController } from './profile.controller';
import { ProfileValidation } from './profile.validation';

const router = express.Router();

// get profile
router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  ProfileController.getProfile
);

// update profile
router.patch(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(ProfileValidation.update),
  ProfileController.updateProfile
);

export const ProfileRoutes = router;
