import { z } from 'zod';

const create = z.object({
  body: z.object({
    serviceId: z.string({ required_error: 'Service ID is Required' }),
    userId: z.string({ required_error: 'User ID is Required' }),
    review: z.string({ required_error: 'Review is Required' }),
    rating: z.number({ required_error: 'Rating is Required' }),
  }),
});

export const ReviewValidation = {
  create,
};
