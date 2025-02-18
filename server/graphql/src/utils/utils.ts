/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import { SheduleStatus } from '.prisma/client';
import moment from 'moment';
import { NotFoundError } from '../schema/graphql/errors';
import { USER_NOT_FOUND_ERROR_MESSAGE } from '../schema/graphql/errors/messages';
import { Context } from '../types/contextType';
import { OutlookSchedule, ScheduleInformation, SlotProps } from '../types/types';
import { AppointmentEntity, ScheduleStatus } from './constants';
import {filterSlotsByWorkingHours} from "../schema/graphql/resolvers/Query/User/timeFilters";
import {checkTokenValidity} from "./googleLogic";
import { google } from 'googleapis';
import {prisma} from "../configs/context";
import {GoogleClient} from "../mail/google/googleClient";
import {configureRedis} from "../configs/redis";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-var-requires
const intersectingRanges = require('intersecting-ranges');
const _ = require('lodash');

export const getRandomDigit = (lenght = 6) => {
  return Math.random().toFixed(lenght).split('.')[1];
};
export interface Iintersect {
  start: Date;
  end: Date;
  duration: number;
}
// ---------------------------RECHERCHE CRENNEAU LOGIQUES-------------------------------------------

export const getAvailableTimeIntersetion = (intervall: Date[][]): SlotProps[] => {
  // console.log('intervall:', intervall);
  // console.log('intersectingRanges(intervall):', intersectingRanges(intervall));
  const res: SlotProps[] = intersectingRanges(intervall).map((item: Date[]) => ({
    start: item[0],
    end: item[1],
    duration: moment(item[1]).diff(moment(item[0]), 'minutes'),
  }));

  return res;
};
export const getDuplicatesChoices = (
  selectedSlot: string[],
  requiredInvited: number,
  duration: number,
) => {
  const aCount = new Map(
    [...new Set(selectedSlot)].map((x) => [x, selectedSlot.filter((y) => y === x).length]),
  );
  for (const itemSelectedSlot of selectedSlot) {
    if ((aCount.get(itemSelectedSlot) as number) >= requiredInvited) {
      const start = moment.utc(itemSelectedSlot).toDate();
      const end = moment.utc(itemSelectedSlot).add(duration, 'minutes').toDate();
      return [{ start, end, duration }];
    }
  }
  return [];
};

export const buildIntersect = (intervall: any[]) => {
  const intersectIntervall = [];
  for (let i = 0; i < intervall.length; i += 1) {
    if (intervall[i].length > 0) {
      for (const itemOfIntervall of intervall[i]) {
        const intervallTabChild = [];

        intervallTabChild.push(new Date(itemOfIntervall.start));
        intervallTabChild.push(new Date(itemOfIntervall.end));
        intersectIntervall.push(intervallTabChild);
      }
    }
  }

  return intersectIntervall;
};
export const buildForDuplicates = (buildedIntervall: Date[][]) => {
  return buildedIntervall.map((item) => item[0].toISOString());
};

export const filterByduration = (intersectIntervall: Iintersect[], duration: number) => {
  const result: { start: Date; end: Date; duration: number }[] = [];
  // eslint-disable-next-line array-callback-return
  intersectIntervall.map((item) => {
    if (duration <= moment(item.end).diff(moment(item.start), 'minutes')) {
      result.push({
        start: item.start,
        end: item.end,
        duration: moment(item.end).diff(moment(item.start), 'minutes'),
      });
    }
  });
  return result;
};

export const getMultipleShedule = (
  intervall: {
    start: Date;
    end: Date;
    duration: number;
  }[],
  duration: number,
  UTC: number,
) => {
  const multipleIntervall: { start: Date; end: Date }[] = [];
  for (const item of intervall) {
    let rootStart = item.start;
    const rootDuration = duration >= 30 ? 30 : duration;

    const startExactlyHour = [
      moment(item.start).set('minutes', 0).set('seconds', 0).toDate(),
      moment(item.start).set('minutes', 30).set('seconds', 0).toDate(),
      moment(item.start).add(30, 'minutes').set('seconds', 0).toDate(),
    ];
    // Test si il est nécessaire d'apporter une modification ou pas
    if (duration > 15) {
      if (moment(item.start).isBetween(startExactlyHour[0], startExactlyHour[1])) {
        if (
          item.duration >= duration &&
          moment(item.end).diff(startExactlyHour[1], 'minutes') >= duration
        ) {
          rootStart = moment(item.start).set('minutes', 30).toDate();
        }
        const temp = moment(item.end).diff(startExactlyHour[1], 'minutes', true);
      } else if (moment(item.start).isAfter(startExactlyHour[1])) {
        if (
          item.duration >= duration &&
          moment(item.end).diff(startExactlyHour[2], 'minutes') >= duration
        ) {
          rootStart = moment(item.start).add(30, 'minutes').set('minutes', 0).toDate();
        }
      }
    }
    multipleIntervall.push(...traitement(rootStart, item.end, rootDuration, duration, UTC));
  }
  console.log(`multipleShedule before timezone==> `, multipleIntervall);
  const test = multipleIntervall.map((item) => ({
    start: moment.utc(item.start).utcOffset(UTC, true).toDate(),
    end: moment.utc(item.end).utcOffset(UTC, true).toDate(),
  }));
  console.log(`multipleShedule after timezone==> `, test);

  // throw new Error('MULTIPLE');

  return multipleIntervall.map((item) => ({
    start: moment.utc(item.start).utcOffset(UTC, true).toDate(),
    end: moment.utc(item.end).utcOffset(UTC, true).toDate(),
  }));
};

const traitement = (
  rootStart: Date,
  rootEnd: Date,
  intervallDuration: number,
  duration: number,
  UTC: number,
) => {
  let start = rootStart;

  let fin = moment(rootStart).add(duration, 'minutes').toDate(); // ceci va nous servir à faire un test sur la nécessité d'appliquer la nouvelle intervalle
  let end = moment(rootStart).add(intervallDuration, 'minutes').toDate(); // ceci permettra d'excecuter une permutation

  const res: { start: Date; end: Date }[] = [];

  while (moment(fin).isBefore(moment(rootEnd).add(10, 'seconds'))) {
    res.push({ start, end: fin });
    start = end;
    end = moment(start).add(intervallDuration, 'minutes').toDate();
    fin = moment(start).add(duration, 'minutes').toDate();
  }

  return res;
};

export const checkWorkingDays = (intersect: Iintersect[], workingDay: string[]) => {
  const workingDaysSet = new Set(workingDay);
  return filterSlotsByWorkingHours(intersect, "00:00", "23:59").map((slot: Iintersect) => {
    const startDayOfWeek = moment(slot?.start).format('dddd');
    const endDayOfWeek = moment(slot?.end).format('dddd');

    // If the slot starts and ends on the same working day, keep the slot as is
    if (workingDaysSet.has(startDayOfWeek) && workingDaysSet.has(endDayOfWeek)) {
      return slot;
    }

    // If the slot spans into a non-working day, adjust the end time and recalculate the duration
    if (workingDaysSet.has(startDayOfWeek) && !workingDaysSet.has(endDayOfWeek)) {
      // Adjust the end time to 23:00 of the start day
      const truncatedEnd = moment(slot.start).endOf('day').set({ hour: 23, minute: 0, second: 0, millisecond: 0 });

      // Recalculate the duration in minutes
      const newDuration = moment.duration(truncatedEnd.diff(moment(slot.start))).asMinutes();

      return { ...slot, end: truncatedEnd.toDate(), duration: newDuration };
    }

    // If the slot starts on a non-working day, exclude it
    return null;
  }).filter(slot => slot !== null); // Remove any null slots
};

export const checkTimetable = (
  intersect: { start: Date; end: Date; duration: number }[],
  workingHours: { begin: string; end: string },
  UTC: number,
) => {
  const { begin: wh_begin, end: wh_end } = workingHours;

  /* Le principe ici est simple on transforme toute les data réçu à la data initiale y compis les heures de pause
   **** ceci permet d'avoir un precision sur l'application d'une heure exact sur les slots trouvé auparavant
   **** à la fin du processus on rend les pendules à l'heure c à d rendre des resultats à UTC 0
   */

  const data = intersect.reduce<Iintersect[]>((acc, current) => {
    let rootStart = moment
      .utc(current.start)
      .utcOffset(+UTC, true)
      .toDate();
    const updatedStart = rootStart;
    let rootEnd = moment
      .utc(current.end)
      .utcOffset(+UTC, true)
      .toDate();
    const updatedEnd = rootEnd;

    let begin = moment
      .utc(updatedStart)
      .set('hours', +wh_begin.split(':')[0])
      .set('minutes', +wh_begin.split(':')[1])
      .set('seconds', 0)
      .toDate();

    let end = moment
      .utc(updatedStart)
      .set('hours', +wh_end.split(':')[0])
      .set('minutes', +wh_end.split(':')[1])
      .set('second', 0)
      .toDate();
    const result: Iintersect[] = [];

    while (
      (moment(begin).isBetween(rootStart, rootEnd, undefined, '[]') ||
        (moment(rootStart).isBetween(begin, end, undefined, '[]') &&
          moment(rootEnd).isBetween(begin, end, undefined, '[]')) ||
        moment(end).isBetween(rootStart, rootEnd, undefined, '[]') ||
        moment(end).isBefore(rootEnd)) &&
      moment(rootStart).isBefore(updatedEnd)
    ) {
      if (moment(rootEnd).isAfter(begin) && moment(end).isAfter(rootStart)) {
        // check start

        if (moment.utc(updatedStart).isBetween(begin, end, undefined, '[]')) {
          rootStart = updatedStart;
        } else if (moment.utc(updatedStart).isBefore(begin)) {
          rootStart = begin;
        }

        // check end

        if (moment.utc(updatedEnd).isAfter(moment(end).add(1, 'minutes').toDate())) {
          rootEnd = end;
        } else if (moment.utc(updatedEnd).isBetween(begin, end, undefined, '[]')) {
          rootEnd = updatedEnd;
        }
      }

      if (
        moment.utc(rootStart).isBetween(begin, end, undefined, '[]') &&
        moment.utc(rootEnd).isBetween(begin, end, undefined, '[]')
      ) {
        result.push({
          duration: moment(rootEnd).diff(rootStart, 'minutes'),
          end: rootEnd,
          start: rootStart,
        });
      }

      end = moment.utc(end).add(1, 'days').toDate();
      begin = moment.utc(begin).add(1, 'days').toDate();
      // pour permettre de parcourir des dates
      rootStart = moment.utc(rootStart).add(1, 'days').set('hours', 0).set('minutes', 0).toDate();
      rootEnd = moment.utc(rootEnd).add(1, 'days').set('hours', 23).set('minutes', 59).toDate();
    }

    return [...acc, ...result];
  }, []);

  const updatedData: Iintersect[] = data.map((item) => ({
    start: moment.utc(item.start).utcOffset(-UTC, true).toDate(),
    end: moment.utc(item.end).utcOffset(-UTC, true).toDate(),
    duration: item.duration,
  }));

  return updatedData;
};

export const buildOutlookScheduleInfo = (
  start: string | Date,
  end: string | Date,
  email: string,
  userInvited?: string[],
  duration?: number,
): ScheduleInformation => {
  return {
    availabilityViewInterval: duration,
    endTime: {
      dateTime: new Date(end).toISOString(),
      timeZone: 'UTC',
    },
    startTime: {
      dateTime: new Date(start).toISOString(),
      timeZone: 'UTC',
    },
    schedules: [email].concat(userInvited && userInvited.length ? userInvited : []),
  };
};

export const slotsFromEvents = (events: SlotProps[], start: string | Date, end: string | Date) => {
  const freeSlots: SlotProps[] = [];

  let rootStart = new Date(start);
  let rootEnd = new Date(end);

  rootEnd = moment(rootEnd).subtract(10, 'seconds').toDate();
  rootStart = moment(rootStart).add(10, 'seconds').toDate();
  if (events.length === 0) {
    freeSlots.push({
      start: moment(rootStart).subtract(10, 'seconds').toDate(),
      end: moment(rootEnd).add(10, 'seconds').toDate(),
      duration: moment(rootEnd).diff(moment(rootStart), 'minutes'),
    });
    return freeSlots;
  }

  events.forEach((event: any) => {
    if (!(moment(rootEnd).isBefore(event.start) || moment(rootStart).isAfter(event.end))) {
      if (moment(rootStart).isBefore(event.start)) {
        freeSlots.push({
          start: moment(rootStart).subtract(10, 'seconds').toDate(),
          end: event.start,
          duration: moment(event.start).diff(rootStart, 'minutes'),
        });
        rootStart = moment(event.end).add(10, 'seconds').toDate();
      } else if (moment(rootStart).isBefore(event.end)) {
        // date de départ se troute au bon milieu d'un event
        rootStart = moment(event.end).add(10, 'seconds').toDate();
      }
    }
  });
  if (moment(rootStart).isBefore(rootEnd)) {
    freeSlots.push({
      start: moment(rootStart).subtract(10, 'seconds').toDate(),
      end: moment(rootEnd).add(10, 'seconds').toDate(),
      duration: moment(moment(rootEnd).add(10, 'seconds').toDate()).diff(
        moment(rootStart).subtract(10, 'seconds').toDate(),
        'minutes',
      ),
    });
  }
  // console.log('free slots:', freeSlots);

  return freeSlots;
};

export const eventExists = (freeBusy: OutlookSchedule) => {
  let thereIsAnEvent = false;
  freeBusy.value.map((event) => {
    if (event.scheduleItems && event.scheduleItems.length) {
      thereIsAnEvent = true;
    }
  });

  return thereIsAnEvent;
};

export const parsedDate = (dateString: string) => {
  const currentDate = moment();
  let date = moment(dateString, 'MMMM Do').year(currentDate.year());

  // If the parsed date is before the current date, set it to the next year
  if (date.isBefore(currentDate, 'day')) {
    date = date.add(1, 'year');
  }

  return date;
};

export const parsedDateUserUTC = (dateString: string) => {
  const date = moment.utc(dateString, 'DD/MM/YYYY').format();
  console.log({ date });
  const parsedDateTest = moment(date).toDate();
  return parsedDateTest;
};
export interface IPreference {
  p_niveau: string[];
}
export const preferenceCheck = async (ctx: Context, mail: string, niv: string, UTC: number) => {
  const user = await ctx.prisma.user.findUnique({ where: { email: mail } });
  if (!user) {
    throw new NotFoundError(USER_NOT_FOUND_ERROR_MESSAGE, mail, '');
  }
  const preferenceData = await ctx.prisma.preference.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (!preferenceData) {
    throw new Error('missing preference data');
  }
  const {
    highCanRescheduleMedium,
    highCanRescheduleLow,
    highCanExtendWorkingTimes,
    hightWorkingHoursBegin: h_wh_begin,
    highWorkingHoursEnd: h_wh_end,
    highCanSkipPauseTimes,
    mediumCanExtendWorkingHours,
    mediumCanRescheduleLow,
    mediumCanSkipPauseTimes,
    mediumWorkingHoursBegin: m_wh_begin,
    mediumWorkingHoursEnd: m_wh_end,
    pauseHours,
    workingDays: wk,
    workingHoursBegin: wh_begin,
    workingHoursEnd: wh_end,
    averageTravelTime,
    waitngResponseTimeForHIM: highResevationTimes,
    waitngResponseTimeForLIM: lowReservationTimes,
    waitngResponseTimeForMIM: mediumReservationTimes,
  } = preferenceData;
  let pauseHoursData: { start: Date; end: Date }[] = JSON.parse(pauseHours);
  pauseHoursData = pauseHoursData.map((item) => ({
    start: new Date(item.start),
    end: new Date(item.end),
  }));
  pauseHoursData = _.orderBy(pauseHoursData, 'start', 'asc');

  const workingDayData: { dayValue: string; isInWorkingDay: boolean }[] = JSON.parse(wk);
  const workingDays = workingDayData.filter((item) => {
    if (item.isInWorkingDay) return item.dayValue;
  });
  // WORKGIN_HOURS BEGIN
  const hightWorkingHoursBegin = moment
    .utc(
      moment
        .utc(h_wh_begin)
        .utcOffset(+UTC, true)
        .toDate(),
    )
    .utcOffset(+UTC, true)
    .format('HH:mm');
  const highWorkingHoursEnd = moment
    .utc(
      moment
        .utc(h_wh_end)
        .utcOffset(+UTC, true)
        .toDate(),
    )
    .utcOffset(+UTC, true)
    .format('HH:mm');
  const mediumWorkingHoursBegin = moment
    .utc(
      moment
        .utc(m_wh_begin)
        .utcOffset(+UTC, true)
        .toDate(),
    )
    .utcOffset(+UTC, true)
    .format('HH:mm');
  const mediumWorkingHoursEnd = moment
    .utc(
      moment
        .utc(m_wh_end)
        .utcOffset(+UTC, true)
        .toDate(),
    )
    .utcOffset(+UTC, true)
    .format('HH:mm');
  const workingHoursBegin = moment
    .utc(
      moment
        .utc(wh_begin)
        .utcOffset(+UTC, true)
        .toDate(),
    )
    .utcOffset(+UTC, true)
    .format('HH:mm');
  const workingHoursEnd = moment
    .utc(
      moment
        .utc(wh_end)
        .utcOffset(+UTC, true)
        .toDate(),
    )
    .utcOffset(+UTC, true)
    .format('HH:mm');
  // WORKIGIN_HOURS END

  let reservationTimes = moment(new Date()).add(30, 'minutes').toDate().toISOString();
  let skipPause = false;
  const niveau: string[] = [];
  switch (niv.toUpperCase()) {
    case AppointmentEntity.HAUTE:
      if (highCanRescheduleLow) {
        niveau.push(AppointmentEntity.FAIBLE);
      }
      if (highCanRescheduleMedium) {
        niveau.push(AppointmentEntity.MOYEN);
      }
      reservationTimes = moment(new Date())
        .add(highResevationTimes, 'minutes')
        .toDate()
        .toISOString();

      if (highCanSkipPauseTimes) {
        skipPause = true;
      }
      break;
    case AppointmentEntity.MOYEN:
      if (mediumCanRescheduleLow) {
        niveau.push(AppointmentEntity.FAIBLE);
      }
      reservationTimes = moment(new Date())
        .add(mediumReservationTimes, 'minutes')
        .toDate()
        .toISOString();
      if (mediumCanSkipPauseTimes) {
        skipPause = true;
      }
      break;
    default:
      reservationTimes = moment(new Date())
        .add(lowReservationTimes, 'minutes')
        .toDate()
        .toISOString();
      skipPause = false;
      break;
  }

  return {
    niveau,
    pauseHoursData,
    workingDays,
    highCanExtendWorkingTimes,
    hightWorkingHoursBegin,
    highWorkingHoursEnd,
    mediumCanExtendWorkingHours,
    mediumCanRescheduleLow,
    mediumWorkingHoursBegin,
    mediumWorkingHoursEnd,
    workingHoursBegin,
    workingHoursEnd,
    averageTravelTime,
    reservationTimes,
    skipPause,
  };
};
export const checkPauseTimes = (
  intersect: { start: Date; end: Date; duration: number }[],
  pauseHours: {
    start: Date;
    end: Date;
  }[],
  UTC: number,
  duration: number,
) => {
  /* même procédé que checkTimesTable */

  const result = intersect.map((itemIntersect) => {
    const rootStart = moment
      .utc(itemIntersect.start)
      .utcOffset(+UTC, true)
      .toDate();
    const rootEnd = moment
      .utc(itemIntersect.end)
      .utcOffset(+UTC, true)
      .toDate();
    const pauseHoursBuilded = pauseHours.map((itemPause) => {
      const pauseBeginHours = moment
        .utc(
          moment
            .utc(itemPause.start)
            .utcOffset(+UTC, true)
            .toDate(),
        )
        .format('HH:mm');
      const pauseEndHours = moment
        .utc(
          moment
            .utc(itemPause.end)
            .utcOffset(+UTC, true)
            .toDate(),
        )
        .format('HH:mm');
      const pauseBeginDate = moment
        .utc(rootStart)
        .hours(+pauseBeginHours.split(':')[0])
        .minutes(+pauseBeginHours.split(':')[1])
        .toDate();
      const pauseEndDate = moment
        .utc(rootEnd)
        .hour(+pauseEndHours.split(':')[0])
        .minutes(+pauseEndHours.split(':')[1])
        .toDate();

      return {
        start: pauseBeginDate,
        end: pauseEndDate,
        duration: Math.abs(moment(pauseEndDate).diff(pauseBeginDate, 'minutes')),
      };
    });

    const res = slotsFromEvents(pauseHoursBuilded, rootStart, rootEnd);

    return res;
  });

  return result
    .reduce((acc, current) => {
      if (current.length) {
        return [...acc, ...current];
      }
      return acc;
    }, [])
    .map((item) => ({
      start: moment.utc(item.start).utcOffset(-UTC, true).toDate(),
      end: moment.utc(item.end).utcOffset(-UTC, true).toDate(),
      duration: item.duration,
    }))
    .filter((item) => item.duration >= duration);
};
export const filterSlotProposal = async (
  debut: Date,
  fin: Date,
  mail: string,
  multipleShedule: {
    start: Date;
    end: Date;
    available: boolean;
  }[],
  ctx: Context,
  UTC: number,
  sheduleId: string,
) => {
  console.log('debut:', moment.utc(debut).format('dddd Do HH:mm'));
  console.log('fin:', moment.utc(fin).format('dddd Do HH:mm'));
  const multipleScheduleBefore = multipleShedule;
  const updatedDebut = moment
    .utc(debut)
    .utcOffset(+UTC, true)
    .toDate();
  const updateFin = moment
    .utc(fin)
    .utcOffset(+UTC, true)
    .toDate();

  let allEventReserved: {
    start: Date;
    end: Date;
  }[] = [];
  const now = new Date().toISOString();

  const schedule = await ctx.prisma.shedule.findMany({
    where: {
      AND: [
        { email: mail },
        {
          OR: [{ status: ScheduleStatus.PENDING }, { status: SheduleStatus.RESCHEDULING_PENDING }],
        },
        { NOT: { OR: [{ debut: { gte: updateFin } }, { fin: { lte: updatedDebut } }] } },
        { reservationExpirationDate: { gte: now } },
      ],
    },
    orderBy: {
      debut: 'desc',
    },
  });

  if (schedule) {
    const eventsReserved = schedule
      .filter((element) => element.reservedSlot.length > 0)
      .map((item) => JSON.parse(item.reservedSlot));
    if (sheduleId.length) {
      const ownerShedule = await ctx.prisma.shedule.findFirst({
        where: { id: sheduleId },
      });

      if (ownerShedule) {
        eventsReserved.push(JSON.parse(ownerShedule.proposedSlots));
      }
    }

    if (eventsReserved.length > 0)
      eventsReserved.forEach((item: any[]) => {
        if (item.length) {
          item.forEach((element: { start: string; end: string }) => {
            allEventReserved.push({
              start: moment.utc(element.start).toDate(),
              end: moment.utc(element.end).toDate(),
            });
          });
        }
      });
  }

  allEventReserved = allEventReserved.map((item) => ({
    start: moment.utc(moment.utc(item.start).toDate()).toDate(),
    end: moment.utc(moment.utc(item.end).toDate()).toDate(),
  }));
  console.log('allEventsReserved ===>', allEventReserved);
  if (allEventReserved.length) {
    let slotFiltered = allEventReserved.reduce<
      {
        available: boolean;
        start: Date;
        end: Date;
      }[]
    >((acc, current) => {
      // const available = slotsFromEvents(
      //   allEventReserved,
      //   new Date(current.start),
      //   new Date(current.end),
      // );

      multipleShedule = multipleShedule.filter((item) => {
        return (
          moment(moment(item.start).add(1, 'second').toDate()).isAfter(current.end) ||
          moment(moment(item.end).subtract(1, 'second').toDate()).isBefore(current.start)
        );
      });

      return [...multipleShedule];
    }, []);
    slotFiltered = slotFiltered.slice(0, 6);
    const lastSlots = slotFiltered.reduce((acc, current) => {
      return acc.filter((item) => item.start !== current.start);
    }, multipleScheduleBefore);
    return { slotFiltered, lastSlots };
  }

  return {
    slotFiltered: multipleShedule.slice(0, 6),
    lastSlots: multipleShedule.slice(6, multipleShedule.length - 1),
  };
};

export const getLocationTextTranslated = (location: string, language: string) => {
  // if (location === 'Demander une localisation') {
  //   return language === 'fr' ? 'Veuillez indiquer la localisation du rendez-vous' : 'Please indicate the location of the meeting';
  // }
  if (!location || location === 'Visioconférence' || location === '') {
    return language === 'fr' ? 'Visioconférence' : 'Video conferencing';
  }
  return location;
};

export async function setupGmailWatchForAllUsers() {
  const googleClient = new GoogleClient();
  const {redis} = configureRedis();

  // Clean Up Previous History IDs
  await redis.del('lastHistoryId');
  const ctx = { prisma, redis, googleClient };

  // Fetch User List where mailService is GOOGLE
  const users = await prisma.user.findMany({
    where: {
      mailService: 'GOOGLE',
    },
  });
  

  for (const user of users) {
    try {
      const userOauth = await prisma.oAuth.findUnique({
        where: { email: user.email },
      });

      if (userOauth) {
        const oAuth2Client = new google.auth.OAuth2();
        // Use the existing function to create Gmail watch
        await googleClient.watchMyLabel(oAuth2Client, user.id, ctx);

        console.log(`Gmail watch setup successful for user: ${user.email}`);
      } else {
        console.error(`OAuth details not found for user: ${user.email}`);
      }
    } catch (error) {
      console.error(`Error setting up Gmail watch for user: ${user.email}`, error);
    }
  }
}

export function splitSlotIntoDays(slot: Iintersect): Iintersect[] {
  const dailySlots: Iintersect[] = [];

  let currentStart = new Date(slot.start);
  const slotEnd = new Date(slot.end);

  while (currentStart < slotEnd) {
    // Start of the next day at 00:00:00 UTC
    const startOfNextDay = new Date(Date.UTC(
        currentStart.getUTCFullYear(),
        currentStart.getUTCMonth(),
        currentStart.getUTCDate() + 1,
        0, 0, 0, 0
    ));

    const currentEnd = new Date(Math.min(startOfNextDay.getTime(), slotEnd.getTime()));
    const duration = (currentEnd.getTime() - currentStart.getTime()) / (1000 * 60); // duration in minutes

    dailySlots.push({
      start: new Date(currentStart),
      end: new Date(currentEnd),
      duration: duration
    });

    currentStart = startOfNextDay;
  }

  return dailySlots;
}

export const filterSlotsByDaysWorkingTimes = (DaysTimeAvailability: any, intersectAll: Iintersect[], UTC = 0) => {
  const availability = JSON.parse(DaysTimeAvailability);

  // Mapping lowercase days to capitalized versions
  const dayMap = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday"
  };

  const filteredSlots = intersectAll.reduce((acc, slot) => {
    const dayName = moment.utc(slot.start).format("dddd").toLowerCase(); // Get lowercase day name

    if (!availability[dayName] || !availability[dayName].isAvailable) {
      return acc; // Skip if the day is unavailable
    }

    const workingHours = {
      begin: moment.utc(availability[dayName].start).format("HH:mm"),
      end: moment.utc(availability[dayName].end).format("HH:mm"),
    };

    let rootStart = moment.utc(slot.start).utcOffset(+UTC, true).toDate();
    let rootEnd = moment.utc(slot.end).utcOffset(+UTC, true).toDate();

    let begin = moment.utc(rootStart).set("hours", +workingHours.begin.split(":")[0]).set("minutes", +workingHours.begin.split(":")[1]).set("seconds", 0).toDate();
    let end = moment.utc(rootStart).set("hours", +workingHours.end.split(":")[0]).set("minutes", +workingHours.end.split(":")[1]).set("seconds", 0).toDate();

    if (moment(rootStart).isBefore(begin)) {
      rootStart = begin; // Adjust start time if it’s before working hours
    }

    if (moment(rootEnd).isAfter(end)) {
      rootEnd = end; // Adjust end time if it’s after working hours
    }

    if (moment(rootStart).isBefore(rootEnd)) {
      acc.push({
        start: rootStart,
        end: rootEnd,
        duration: moment(rootEnd).diff(rootStart, "minutes"),
      });
    }

    return acc;
  }, []);

  return filteredSlots;
};

export const splitSlotsByDuration = (intersectAll: Iintersect[], duration: number) => {
  const splitSlots: Iintersect[] = [];

  intersectAll.forEach(slot => {
    let start = moment.utc(slot.start);
    let end = moment.utc(slot.end);

    while (start.isBefore(end)) {
      let newEnd = moment(start).add(duration, 'minutes');

      // Ensure the last slot does not exceed the original end time
      if (newEnd.isAfter(end)) {
        break;
      }

      splitSlots.push({
        start: start.toISOString(),
        end: newEnd.toISOString(),
        duration: duration
      });

      start = newEnd; // Move to the next slot
    }
  });

  return splitSlots;
};

export const formatAvailability = (availabilityData) => {
  const formattedAvailability = {};
  availabilityData.forEach(slot => {
    const date = moment.utc(slot.start).format("YYYY-MM-DD"); // Extract date
    const time = moment.utc(slot.start).format("HH:mm"); // Extract start time

    if (!formattedAvailability[date]) {
      formattedAvailability[date] = [];
    }
    formattedAvailability[date].push(time);
  });

  // Convert object to array of { date, times }
  return {
    availability: Object.keys(formattedAvailability).map(date => ({
      date: date,
      times: formattedAvailability[date]
    }))
  };
};