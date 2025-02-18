import moment from 'moment';
export const buildIsoStringDateTimeFromMl = (
  dateEntity: {
    date?: string[];
    duration: number;
    time?: string[];
    anc_date?: string[];
    new_date?: string[];
  }[],
) => {
  //   ============================== typeMail 0 ======================================
  if (dateEntity && dateEntity.length) {
    return dateEntity.map((entity) => {
      if (
        entity.date &&
        entity.date.length &&
        entity.time &&
        entity.time.length &&
        entity.time.length > 1
      ) {
        const startTime = entity.time
          ? entity.time[0].split(':').map((item) => Number(item))
          : null;
        const endTime = entity.time ? entity.time[1].split(':').map((item) => Number(item)) : null;

        const rdvDate = buildCorrectDate(entity.date[0]);

        if (startTime && endTime && startTime.length > 1 && endTime.length > 1) {
          const startDateTime = moment(
            new Date(new Date(rdvDate).setHours(startTime[0], startTime[1])),
          )
            .utc()
            .format('DD/MM/YYYY HH:mm:ss');
          const endDateTime = moment(new Date(new Date(rdvDate).setHours(endTime[0], endTime[1])))
            .utc()
            .format('DD/MM/YYYY HH:mm:ss');
          return {
            date: [startDateTime.split(' ')[0]],
            time: [startDateTime.split(' ')[1], endDateTime.split(' ')[1]],
            duration: moment(new Date(new Date(rdvDate).setHours(endTime[0], endTime[1]))).diff(
              new Date(new Date(rdvDate).setHours(startTime[0], startTime[1])),
              'minutes',
            ),
          };
        }
      }
      // ============================================ typeMail 1 ========================================
      if (
        entity.anc_date &&
        entity.anc_date.length &&
        entity.new_date &&
        entity.new_date.length &&
        entity.time &&
        entity.time.length
      ) {
        const parsedNewDate = buildCorrectDate(entity.anc_date[0]);
        const startTime = entity.time
          ? entity.time[0].split(':').map((item) => Number(item))
          : null;
        const endTime = entity.time ? entity.time[1].split(':').map((item) => Number(item)) : null;

        if (startTime && endTime && startTime.length > 1 && endTime.length > 1) {
          const startDateTime = moment(
            new Date(new Date(parsedNewDate).setHours(startTime[0], startTime[1])),
          )
            .utc()
            .format('DD/MM/YYYY HH:mm:ss');
          const endDateTime = moment(
            new Date(new Date(parsedNewDate).setHours(endTime[0], endTime[1])),
          )
            .utc()
            .format('DD/MM/YYYY HH:mm:ss');
          return {
            anc_date: entity.anc_date,
            new_date: [startDateTime.split(' ')[0]],
            time: [startDateTime.split(' ')[1], endDateTime.split(' ')[1]],
            duration: moment(
              new Date(new Date(parsedNewDate).setHours(endTime[0], endTime[1])),
            ).diff(
              new Date(new Date(parsedNewDate).setHours(startTime[0], startTime[1])),
              'minutes',
            ),
          };
        }
      }
    });
  }
};

const buildCorrectDate = (dateString: string) => {
  const splittedDate = dateString.split('/');

  return `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`;
};

export const revertIsoToClientDate = (
  dateEntity: {
    date?: string[];
    duration: number;
    time?: string[];
    anc_date?: string[];
    new_date?: string[];
  }[],
) => {
  if (dateEntity && dateEntity.length) {
    return dateEntity.map((entity) => {
      if (
        entity.date &&
        entity.date.length &&
        entity.time &&
        entity.time.length &&
        entity.time.length > 1
      ) {
        const startTime = entity.time
          ? entity.time[0].split(':').map((item) => Number(item))
          : null;
        const endTime = entity.time ? entity.time[1].split(':').map((item) => Number(item)) : null;

        const rdvDate = buildCorrectDate(entity.date[0]);

        if (startTime && endTime && startTime.length > 1 && endTime.length > 1) {
          const startDateTime = moment(
            new Date(new Date(rdvDate).setHours(startTime[0], startTime[1])),
          )
            .add(moment().utcOffset(), 'minutes')
            .format('DD/MM/YYYY HH:mm');

          const endDateTime = moment(new Date(new Date(rdvDate).setHours(endTime[0], endTime[1])))
            .add(moment().utcOffset(), 'minutes')
            .format('DD/MM/YYYY HH:mm');
          return {
            date: [startDateTime.split(' ')[0]],
            time: [startDateTime.split(' ')[1], endDateTime.split(' ')[1]],
            duration: moment(new Date(new Date(rdvDate).setHours(endTime[0], endTime[1]))).diff(
              new Date(new Date(rdvDate).setHours(startTime[0], startTime[1])),
              'minutes',
            ),
          };
        }
      }
      // ============================================ typeMail 1 ========================================
      if (
        entity.anc_date &&
        entity.anc_date.length &&
        entity.new_date &&
        entity.new_date.length &&
        entity.time &&
        entity.time.length
      ) {
        const parsedNewDate = buildCorrectDate(entity.new_date[0]);
        const startTime = entity.time
          ? entity.time[0].split(':').map((item) => Number(item))
          : null;
        const endTime = entity.time ? entity.time[1].split(':').map((item) => Number(item)) : null;

        if (startTime && endTime && startTime.length > 1 && endTime.length > 1) {
          const startDateTime = moment(
            new Date(new Date(parsedNewDate).setHours(startTime[0], startTime[1])),
          )
            .add(moment().utcOffset(), 'minutes')
            .format('DD/MM/YYYY HH:mm');
          const endDateTime = moment(
            new Date(new Date(parsedNewDate).setHours(endTime[0], endTime[1])),
          )
            .add(moment().utcOffset(), 'minutes')
            .format('DD/MM/YYYY HH:mm');
          return {
            anc_date: entity.anc_date,
            new_date: [startDateTime.split(' ')[0]],
            time: [startDateTime.split(' ')[1], endDateTime.split(' ')[1]],
            duration: moment(
              new Date(new Date(parsedNewDate).setHours(endTime[0], endTime[1])),
            ).diff(
              new Date(new Date(parsedNewDate).setHours(startTime[0], startTime[1])),
              'minutes',
            ),
          };
        }
      }
    });
  }
};
