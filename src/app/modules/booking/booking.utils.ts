import prisma from '../../../shared/prisma';

// find Last ID
const findLastId = async (): Promise<string> => {
  const currentId = await prisma.booking.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      bookingNo: true,
    },
  });

  const splitCurrent = currentId?.bookingNo?.split('B') || ['', '0'];

  return splitCurrent[1];
};
// generate booking no
export const generateBookingNo = async (): Promise<string> => {
  const currentId = parseInt(await findLastId());
  const incrementId = currentId + 1;

  return incrementId?.toString().padStart(6, 'B000000');
};
