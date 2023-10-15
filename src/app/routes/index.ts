import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { UserRoutes } from '../modules/user/user.route';
import { ServiceRoutes } from '../modules/service/service.route';
import { ReviewRoutes } from '../modules/review/review.route';
import { FeedbackRoutes } from '../modules/feedback/feedback.route';
import { BlogRoutes } from '../modules/blog/blog.route';
import { FaqRoutes } from '../modules/faq/faq.route';
import { ProfileRoutes } from '../modules/profile/profile.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/profile',
    route: ProfileRoutes,
  },
  {
    path: '/service',
    route: ServiceRoutes,
  },
  {
    path: '/review',
    route: ReviewRoutes,
  },
  {
    path: '/feedback',
    route: FeedbackRoutes,
  },
  {
    path: '/blog',
    route: BlogRoutes,
  },
  {
    path: '/faq',
    route: FaqRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
