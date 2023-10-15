import { z } from 'zod';

const update = z.object({
  body: z.object({
    fullName: z.string().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    mobile: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    profileImg: z.string().optional().nullable(),
  }),
});

export const ProfileValidation = {
  update,
};
