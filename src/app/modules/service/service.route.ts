import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { ServiceController } from './service.controller';
import { ServiceValidation } from './service.validation';

const router = express.Router();

// create service
router.post(
  '/create',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(ServiceValidation.create),
  ServiceController.createService
);

// get all services
router.get('/', ServiceController.getAllServices);

// get single service
router.get('/:id', ServiceController.getSingleService);

// update service
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(ServiceValidation.update),
  ServiceController.updateService
);

// delete service
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ServiceController.deleteService
);

export const ServiceRoutes = router;
