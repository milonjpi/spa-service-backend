import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Blog, User } from '@prisma/client';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { BlogService } from './blog.service';
import { blogFilterableFields } from './blog.constant';

// create blog
const createBlog = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const user = req.user as Pick<User, 'id' | 'role'>;
  data.userId = user.id;

  const result = await BlogService.createBlog(data);

  sendResponse<Blog>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Blog Created Successfully',
    data: result,
  });
});

// get all blogs
const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, blogFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await BlogService.getAllBlogs(filters, paginationOptions);

  sendResponse<Blog[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blogs retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single blog
const getSingleBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BlogService.getSingleBlog(id);

  sendResponse<Blog>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog retrieved successfully',
    data: result,
  });
});

// update blog
const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await BlogService.updateBlog(id, data);

  sendResponse<Blog>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Blog Updated Successfully',
    data: result,
  });
});

// delete blog
const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BlogService.deleteBlog(id);

  sendResponse<Blog>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog Deleted successfully',
    data: result,
  });
});

export const BlogController = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};
