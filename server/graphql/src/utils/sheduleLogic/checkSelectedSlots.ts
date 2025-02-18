import moment from 'moment';
import { Context } from '../../types/contextType';
import { SlotProps } from '../../types/types';
import { slotsFromEvents } from '../utils';

export const checkSelectedSlot = async (
  id: string,
  ctx: Context,
  UTC: number,
  duration: number,
  availableSlot: SlotProps[],
) => {
  const { prisma } = ctx;
  const currentShedule = await prisma.shedule.findUnique({ where: { id } });
  if (!currentShedule) {
    throw new Error('Missing current shedule');
  }
  const reservedSlots: { start: Date; end: Date }[] = JSON.parse(currentShedule.reservedSlot);
  const allEventReserved = reservedSlots.map((item) => ({
    start: moment.utc(moment.utc(item.start).toDate()).utcOffset(-UTC, true).toDate(),
    end: moment.utc(moment.utc(item.end).toDate()).utcOffset(-UTC, true).toDate(),
    duration: Math.abs(
      moment(moment.utc(item.end).utcOffset(-UTC, true).toDate()).diff(
        moment.utc(item.start).utcOffset(-UTC, true).toDate(),
      ),
    ),
  }));
  const res = availableSlot.reduce<SlotProps[]>((acc, current) => {
    const available = slotsFromEvents(
      allEventReserved,
      new Date(current.start),
      new Date(current.end),
    );

    return [...acc, ...available];
  }, []);
  console.log(res);
  return res.filter((item) => item.duration >= duration);
};
