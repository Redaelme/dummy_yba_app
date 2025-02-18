/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
export const RESET_PASSWORD_KEY = 'reset-password:user';
export const MS_PERSON_TYPE_SUBCLASS = 'PersonalContact';

export enum EntityTypes {
  UNKNOWN = 'UNKNOWN',
  USER = 'USERS',
  O_AUTH = 'O_AUTH',
  SCHEDULE = 'SCHEDULE',
  OUTLOOK_OAUTH_ACCOUNT = 'OUTLOOK_OAUTH_ACCOUNT',
  UNHAUTHORIZED = 'UNHAUTHORIZED',
  INCOMING_REQUEST = 'INCOMING_REQUEST',
}

export enum GraphErrorTypes {
  ENDPOINTS_RESOLUTION_ERROR = 'endpoints_resolution_error',
  INVALID_GRANT = 'invalid_grant',
  UNHAUTHORIZED = 'UNHAUTHORIZED',
  TRANSIENT = 'ErrorMessageTransientError',
}

export const TIMESLOT = 'timeSlots';
export const APPOINTMENT = 'Appointments';
export const REMOVED_EVENTS = 'REMOVED_EVENTS';
export const MAIL_ID = 'MAIL_ID';
export const STOP_GMAIL_WATCH = 'STOP_GMAIL_WATCH';
export const CTX_REGISTER = 'CTX';
export const RECEIVED_DATETIME = 'RDT';
export const SCHEDULE_ACCECPTED_SLOT = 'acceptedSlot';

export enum AppointmentEntity {
  HAUTE = 'HAUT',
  MOYEN = 'MOYEN',
  FAIBLE = 'FAIBLE',
}
export enum ScheduleStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  CANCELED = 'CANCELED',
}
// =====GCALENDAR CONSTANTS=====
export enum GCalendarStatus {
  CONFIRMED = 'confirmed',
  TENTATIVE = 'tentative',
  CANCELED = 'canceled',
  ACCEPTED = 'accepted',
}
export enum GCalendarColor {
  BLUE = 1,

  GREEN = 2,

  PURPLE = 3,

  RED = 4,

  YELLOW = 5,

  ORANGE = 6,

  TURQUOISE = 7,

  GRAY = 8,

  BOLD_BLUE = 9,

  BOLD_GREEN = 10,

  BOLD_RED = 11,
}
export enum GCalendarTransparency {
  OPAQUE = 'opaque', // Cela équivaut à définir Me montrer comme sur Occupé dans l'interface utilisateur du calendrier
  TRANSPARENT = ' transparent', // Cela équivaut à définir Me montrer comme sur Disponible dans l'interface utilisateur du calendrier.
}
export enum GCalendarVisibility {
  DEFAULT = 'default',
  PUBLIC = 'public',
  PRIVATE = 'private',
  CONFIDENTIAL = 'confidential',
}

export enum TemplateNames {
  CHOOSE_SLOTS = 'chooseSlots',
  FORGOT_PASSWORD = 'forgotPassword',
  SLOT_PROPOSAL = 'slotProposal',
  RESEND_SLOT_PROPOSAL = 'resendSlotProposal',
  SUCCESSFUL_RESPONSE = 'successfulResponse',
  ASK_OTHER_SLOT_CONFIRMATION = 'askOtherSlotConfirmation',
  REQUIRED_ATTENDEE_UNAVAILABLE = 'requiredAttendeeUnavailable',
  AVAILABILITY_CONFIRMATION = 'availabilityConfirmation',
  REMINDER_MEETING = 'reminderMeeting',
  SLOT_PROPOSAL_COUNT_EXCEEDED = 'slotProposalCountExceeded',
  ERROR = 'error',
  UNAUTHORIZED_REQUEST = 'unauthorizedRequest',
  ACCEPT_INCOMING_WITH_VISIO = 'acceptIncomingWithVisio',
  ACCEPT_INCOMING_WITHOUT_VISIO = 'acceptIncomingWithoutVisio',
  ACCEPT_INCOMING_WITHOUT_SLOT_PROPOSAL = 'acceptIncomingWithoutSlotProposal',
  ACCEPT_INCOMING_SLOT_NOT_SUITABLE = 'acceptIncomingSlotNotSuitable',
  ACCEPT_INCOMING_WITHOUT_LOCATION_PROPOSAL = 'acceptIncomingWithoutLocationProposal',
  REFUSAL_MAIL_INCOMING_REQUEST = 'refusalMailIncomingRequest',
  SIMPLE_RESCHEDULING_SLOT = 'simpleReschedulingSlot',
  USER_ACCESS_BO = 'userAccessBO',
}

export enum RedisHashKeys {
  TIME_SLOTS = 'timeSlots',
  INDEX_OF_LAST_SLOTS = 'indexOfLastSlots',
}
export const GMAIL_REGISTER = 'GMAIL_REGISTER';

export enum NotificationTypes {
  INCOMING_EMAIL = 'INCOMING_EMAIL',
  SCHEDULE = 'SCHEDULE',
  ROOM = 'ROOM',
  SUB = 'SUB',
  BOOKING = 'BOOKING',
}

export enum MSEventStatus {
  NONE = 'none',
  ORGANIZER = 'organizer',
  TENTATIVELY_ACCEPTED = 'tentativelyAccepted',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  NOT_RESPONDED = 'notResponded',
}
