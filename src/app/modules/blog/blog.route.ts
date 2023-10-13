import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { BlogValidation } from './blog.validation';
import { BlogController } from './blog.controller';

const router = express.Router();

// create blog
router.post(
  '/create',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(BlogValidation.create),
  BlogController.createBlog
);

// get all blogs
router.get('/', BlogController.getAllBlogs);

// get single blog
router.get('/:id', BlogController.getSingleBlog);

// update Blog
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(BlogValidation.update),
  BlogController.updateBlog
);

// delete Blog
router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), BlogController.deleteBlog);

export const BlogRoutes = router;
