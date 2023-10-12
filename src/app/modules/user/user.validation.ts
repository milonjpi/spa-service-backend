import { z } from 'zod';
import { userRoles } from './user.constant';

const update = z.object({
  body: z.object({
    fullName: z.string().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    role: z.enum(userRoles as [string, ...string[]]).optional(),
    mobile: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    profileImg: z.string().optional().nullable(),
  }),
});

export const UserValidation = {
  update,
};
