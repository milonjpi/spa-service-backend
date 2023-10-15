import { Prisma } from '@prisma/client';
import { IGenericErrorMessage } from '../interfaces/error';

const handleInitializeError = (
  error: Prisma.PrismaClientInitializationError
) => {
  let errors: IGenericErrorMessage[] = [];
  let message = '';
  const statusCode = 400;
  console.log(error);
  message = 'Internal Server Error, Try Again!!';
  errors = [
    {
      path: '',
      message,
    },
  ];

  return {
    statusCode,
    message,
    errorMessages: errors,
  };
};

export default handleInitializeError;
