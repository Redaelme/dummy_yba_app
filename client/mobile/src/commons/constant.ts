export const NOTIFICATION_TOKEN = 'NOTIFICATION_TOKEN';
export const NAVIGATION_REGISTER = 'NAVIGATION_TO_INDEX';
export const INCOMING_EMAIL_REGISTER = 'INCOMING_EMAIL_REGISTER';
export const MESSAGE_ID = 'MESSAGE_ID';
export const SCHEDULE_TO_UPDATE = 'SCHEDULE_TO_UPDATE';
export const BEGIN_WH = 'BEGIN';
export const END_WH = 'END';
export const NO_REFRESH_TOKEN_IS_SET_ERROR = 'No refresh token is set.';

export enum NotificationTypes {
  INCOMING_EMAIL = 'INCOMING_EMAIL',
  SCHEDULE = 'SCHEDULE',
  ROOM = 'ROOM',
  SUB = 'SUB',
    BOOKING = 'BOOKING',
}

export enum ScheduleStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  CANCELED = 'CANCELED',
}

export enum CalendarTypes {
  APPLE_CALENDAR = 'APPLE_CALENDAR',
  GOOGLE = 'GOOGLE',
}

export enum CalendarPermissions {
  AUTHORIZED = 'authorized',
  RESTRICTED = 'restricted',
  DENIED = 'denied',
  UNDETERMINED = 'undetermined',
}
