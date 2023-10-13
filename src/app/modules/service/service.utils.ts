import prisma from '../../../shared/prisma';

// find Last ID
const findLastId = async (): Promise<string> => {
  const currentId = await prisma.service.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      serviceNo: true,
    },
  });

  const splitCurrent = currentId?.serviceNo?.split('S') || ['', '0'];

  return splitCurrent[1];
};
// generate service no
export const generateServiceNo = async (): Promise<string> => {
  const currentId = parseInt(await findLastId());
  const incrementId = currentId + 1;

  return incrementId?.toString().padStart(5, 'S000000');
};
