import { z } from 'zod';

const create = z.object({
  body: z.object({
    comment: z.string({ required_error: 'Comment is Required' }),
    suggestion: z.string().optional().nullable(),
  }),
});

export const FeedbackValidation = {
  create,
};
