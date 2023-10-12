import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { Prisma, Service } from '@prisma/client';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IServiceFilters } from './service.interface';
import { serviceSearchableFields } from './service.constant';

// create service
const createService = async (data: Service): Promise<Service | null> => {
  const result = await prisma.service.create({ data });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create service');
  }

  return result;
};

// get all services
const getAllServices = async (
  filters: IServiceFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Service[]>> => {
  const { searchTerm, minPrice, maxPrice, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: serviceSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (minPrice) {
    andConditions.push({ price: { gte: Number(minPrice) } });
  }

  if (maxPrice) {
    andConditions.push({ price: { lte: Number(maxPrice) } });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions: Prisma.ServiceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.service.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.service.count({
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

// get single Service
const getSingleService = async (id: string): Promise<Service | null> => {
  const result = await prisma.service.findUnique({
    where: {
      id,
    },
    include: {
      reviewRatings: true,
    },
  });

  return result;
};

// update service
const updateService = async (
  id: string,
  payload: Partial<Service>
): Promise<Service | null> => {
  // check is exist
  const isExist = await prisma.service.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service Not Found');
  }

  const result = await prisma.service.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to Update Service');
  }

  return result;
};

// delete service
const deleteService = async (id: string): Promise<Service | null> => {
  // check is exist
  const isExist = await prisma.service.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service Not Found');
  }

  const result = await prisma.service.delete({
    where: {
      id,
    },
  });

  return result;
};

export const SpaService = {
  createService,
  getAllServices,
  getSingleService,
  updateService,
  deleteService,
};
