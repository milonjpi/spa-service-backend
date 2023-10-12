import { z } from 'zod';
import { userRoles } from '../user/user.constant';

const signUp = z.object({
  body: z.object({
    fullName: z.string({
      required_error: 'Full Name is required',
    }),
    email: z.string({
      required_error: 'Email is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
    role: z.enum(userRoles as [string, ...string[]]).optional(),
    profileImg: z.string().optional(),
  }),
});

const signIn = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is Required' }),
    password: z.string({ required_error: 'Password is Required' }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});

export const AuthValidation = {
  signUp,
  signIn,
  refreshTokenZodSchema,
};
