import { z } from 'zod';
import { serviceCategory, serviceStatus } from './service.constant';

const create = z.object({
  body: z.object({
    serviceName: z.string({ required_error: 'Service Name is Required' }),
    description: z.string({ required_error: 'Description is Required' }),
    category: z.enum([...serviceCategory] as [string, ...string[]], {
      required_error: 'Category is required',
    }),
    price: z.number({ required_error: 'Price is Required' }),
    status: z.enum([...serviceStatus] as [string, ...string[]], {
      required_error: 'Status is Required',
    }),
  }),
});

const update = z.object({
  body: z.object({
    serviceName: z.string().optional(),
    description: z.string().optional(),
    category: z.enum([...serviceCategory] as [string, ...string[]]).optional(),
    price: z.number().optional(),
    status: z.enum([...serviceStatus] as [string, ...string[]]).optional(),
  }),
});

export const ServiceValidation = {
  create,
  update,
};
