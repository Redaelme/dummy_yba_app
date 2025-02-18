import base64 from 'react-native-base64';
import RNCalendarEvents from 'react-native-calendar-events';
import { CalendarPermissions } from '../commons/constant';

const calendarType = 'LOCAL';

export const getCalendarPermission = async () => {
  const request = await RNCalendarEvents.requestPermissions();
  if (request === CalendarPermissions.AUTHORIZED) {
    return request;
  }
  return request;
};

export const getLocaleCalendar = async () => {
  const calendars = await RNCalendarEvents.findCalendars();
  const localCalendar = calendars.find(({ type }) => type === calendarType);
  if (!localCalendar) {
    return null;
  }
  return localCalendar;
};

export const checkEvent = async (
  start: string,
  end: string,
  scheduleId: string,
  calendarId?: string[],
) => {
  const checkAllEvents = await RNCalendarEvents.fetchAllEvents(start, end, calendarId);

  if (checkAllEvents.length) {
    const event = checkAllEvents.find((event) => {
      if (event && event.notes && event.notes.includes('[[') && event.notes.includes(']]')) {
        const scheduleIdDecoded = base64.decode(event.notes.split('[[')[1].split(']]')[0]);
        return scheduleId === scheduleIdDecoded;
      }
    });

    if (event) {
      return event;
    }
  }
};
