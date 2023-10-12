import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Service } from '@prisma/client';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { SpaServices } from './service.service';
import { serviceFilterableFields } from './service.constant';

// create service
const createService = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await SpaServices.createService(data);

  sendResponse<Service>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Service Created Successfully',
    data: result,
  });
});

// get all services
const getAllServices = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, serviceFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await SpaServices.getAllServices(filters, paginationOptions);

  sendResponse<Service[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Services retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single Service
const getSingleService = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await SpaServices.getSingleService(id);

  sendResponse<Service>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service retrieved successfully',
    data: result,
  });
});

// update service
const updateService = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await SpaServices.updateService(id, data);

  sendResponse<Service>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Service Updated Successfully',
    data: result,
  });
});

// delete service
const deleteService = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await SpaServices.deleteService(id);

  sendResponse<Service>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service Deleted successfully',
    data: result,
  });
});

export const ServiceController = {
  createService,
  getAllServices,
  getSingleService,
  updateService,
  deleteService,
};
