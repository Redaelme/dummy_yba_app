import { google } from 'googleapis';
import { NotFoundError } from '../../schema/graphql/errors';
import { USER_NOT_FOUND_ERROR_MESSAGE } from '../../schema/graphql/errors/messages';
import { Context } from '../../types/contextType';
import { OAuth2Client } from '../../types/types';
import { EntityTypes } from '../constants';
interface RoomAvailability {
  id: string;
  busy: boolean;
}

export const checkAvailabilityRoom = async (
  ctx: Context,
  mail: string,
  start: string,
  end: string,
  location: string,
  auth: OAuth2Client,
) => {
  console.log('email:', mail);

  const { prisma } = ctx;
  const currentUser = await prisma.user.findUnique({ where: { email: mail } });
  if (!currentUser) {
    throw new NotFoundError(USER_NOT_FOUND_ERROR_MESSAGE, 'email', mail, '', EntityTypes.SCHEDULE);
  }

  if (currentUser.mailService === 'GOOGLE' && location.length) {
    const address = await prisma.address.findFirst({
      where: {
        AND: [{ libelle: location.split('(')[0].trim() }, { userId: currentUser.id }],
      },
    });
    if (!address) {
      return null;
    }
    console.log('addres in prisma:', address);

    const room = await prisma.room.findMany({ where: { address } });
    const tokenOfCreator = await ctx.prisma.oAuth.findUnique({
      where: { email: mail },
    });
    if (tokenOfCreator) {
      const allRoomAvailability = new Promise<RoomAvailability[]>((resolve) => {
        const calendar = google.calendar({ version: 'v3', auth });
        calendar.freebusy.query(
          {
            alt: 'JSON',
            auth,
            requestBody: {
              timeMin: start,
              timeMax: end,
              items: room.map((item) => ({ id: item.resourceEmail })),
            },
          },
          (err: any, data: any) => {
            console.log('err>', err);
            console.log('data.data.calendars', data.data.calendars);

            if (err || !data) {
              console.log('Access denied for:', mail, err.errors);
            }
            const roomAvailability: RoomAvailability[] = room.map((itemRoom) => ({
              id: itemRoom.resourceEmail,
              busy: data.data.calendars[itemRoom.resourceEmail].busy.length > 0,
            }));

            resolve(roomAvailability.filter((itemAvailable) => itemAvailable.busy === false));
          },
        );
      });
      const res = await allRoomAvailability;

      return { ids: res.map((resItem) => resItem.id), address: address || {} };
    }
  }
  return { ids: [], address: null };
};
