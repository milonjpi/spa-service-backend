import { z } from 'zod';
import { userRoles } from './user.constant';

const create = z.object({
  body: z.object({
    fullName: z.string({
      required_error: 'Full Name is required',
    }),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({ message: 'Invalid Email Address' }),
    password: z.string({
      required_error: 'Password is required',
    }),
    role: z.enum(userRoles as [string, ...string[]]).optional(),
  }),
});

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
  create,
  update,
};
