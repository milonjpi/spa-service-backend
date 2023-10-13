import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Faq, Prisma } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IFaqFilters } from './faq.interface';
import { faqSearchableFields } from './faq.constant';

// create FAQ
const createFaq = async (data: Faq): Promise<Faq | null> => {
  const result = await prisma.faq.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create FAQ');
  }

  return result;
};

// get all FAQs
const getAllFaqs = async (
  filters: IFaqFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Faq[]>> => {
  const { searchTerm } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: faqSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.FaqWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.faq.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.faq.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};

// update FAQ
const updateFaq = async (
  id: string,
  payload: Partial<Faq>
): Promise<Faq | null> => {
  // check is exist
  const isExist = await prisma.faq.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'FAQ Not Found');
  }

  const result = await prisma.faq.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update FAQ');
  }

  return result;
};

// delete FAQ
const deleteFaq = async (id: string): Promise<Faq | null> => {
  // check is exist
  const isExist = await prisma.faq.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'FAQ Not Found');
  }

  const result = await prisma.faq.delete({
    where: {
      id,
    },
  });

  return result;
};

export const FaqService = {
  createFaq,
  getAllFaqs,
  updateFaq,
  deleteFaq,
};
