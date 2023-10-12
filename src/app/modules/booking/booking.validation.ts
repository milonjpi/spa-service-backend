import { z } from 'zod';

const create = z.object({
  body: z.object({
    serviceId: z.string({ required_error: 'Service ID is Required' }),
    userId: z.string({ required_error: 'User ID is Required' }),
    scheduleTime: z.string({ required_error: 'Schedule Time is Required' }),
    price: z.number({ required_error: 'Price is Required' }),
  }),
});

const confirm = z.object({
  body: z.object({
    scheduleTime: z.string({ required_error: 'Schedule Time is Required' }),
  }),
});

export const BookingValidation = {
  create,
  confirm,
};
