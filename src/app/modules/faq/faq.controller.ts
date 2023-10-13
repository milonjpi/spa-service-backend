import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Faq } from '@prisma/client';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { FaqService } from './faq.service';
import { faqFilterableFields } from './faq.constant';

// create FAQ
const createFaq = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await FaqService.createFaq(data);

  sendResponse<Faq>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'FAQ Created Successfully',
    data: result,
  });
});

// get all FAQs
const getAllFaqs = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, faqFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await FaqService.getAllFaqs(filters, paginationOptions);

  sendResponse<Faq[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'FAQs retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// update faq
const updateFaq = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await FaqService.updateFaq(id, data);

  sendResponse<Faq>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'FAQ Updated Successfully',
    data: result,
  });
});

// delete faq
const deleteFaq = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await FaqService.deleteFaq(id);

  sendResponse<Faq>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'FAQ Deleted successfully',
    data: result,
  });
});

export const FaqController = {
  createFaq,
  getAllFaqs,
  updateFaq,
  deleteFaq,
};
