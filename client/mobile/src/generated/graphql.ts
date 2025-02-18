/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-use-before-define */
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Date custom scalar type */
  DateTime: any;
};

export type AcceptMailInput = {
  id: Scalars['String'];
  appointmentUserAction: Scalars['String'];
  emailPayload?: Scalars['String'];
};

export type AcceptMailWithVisioInput = {
  from: Scalars['String'];
  to: Scalars['String'];
  subject: Scalars['String'];
  date: Scalars['String'];
};

export type AcceptMailWithoutSlotProposalInput = {
  from: Scalars['String'];
  to: Scalars['String'];
  subject: Scalars['String'];
  calendar: Scalars['String'];
  location: Scalars['String'];
  slotProposal: Array<Maybe<Scalars['String']>>;
};

export type AddressInput = {
  libelle: Scalars['String'];
  adresse: Scalars['String'];
  isRemoved: Scalars['Boolean'];
  userId: Scalars['String'];
};

export type AddressType = {
  __typename?: 'AddressType';
  id: Scalars['String'];
  libelle: Scalars['String'];
  adresse: Scalars['String'];
  isRemoved?: Maybe<Scalars['Boolean']>;
  defaultAddress: Scalars['Boolean'];
  fromRemote: Scalars['Boolean'];
  userId?: Maybe<Scalars['String']>;
};

export type AppointmentsShedulerInput = {
  userInvited?: Maybe<Array<Maybe<UserInfoInput>>>;
  duration: Scalars['Int'];
  email: Scalars['String'];
  debut: Scalars['DateTime'];
  fin: Scalars['DateTime'];
  objet: Scalars['String'];
  sujet?: Maybe<Scalars['String']>;
  niveau: Scalars['String'];
  localisation: Localisation;
  buildingId: Scalars['String'];
  addressId?: Maybe<Scalars['String']>;
  reminder: Scalars['String'];
  UTC: Scalars['Int'];
  template?: Maybe<Scalars['String']>;
  fullName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  scheduleId?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
  eventId?: Maybe<Scalars['String']>;
  capacity?: Maybe<Scalars['Int']>;
  meetingRescheduled?: Maybe<Scalars['Boolean']>;
};

export type Attendees = {
  __typename?: 'Attendees';
  email?: Maybe<Scalars['String']>;
  responseStatus?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type AuthUser = {
  __typename?: 'AuthUser';
  user: User;
  token: Scalars['String'];
  completedSignUp?: Maybe<Scalars['Boolean']>;
};

export type AuthUserBo = {
  __typename?: 'AuthUserBO';
  userBO: UserBo;
  token: Scalars['String'];
};

export type BookingLinkInput = {
  userId: Scalars['String'];
  language: Scalars['String'];
  duration: Scalars['Int'];
  level: Scalars['String'];
  expirationDuration: Scalars['Int'];
  bookingTimes?: Maybe<BookingTimesInput>;
};

export type BookingTime = {
  __typename?: 'BookingTime';
  start: Scalars['String'];
  end: Scalars['String'];
  isAvailable: Scalars['Boolean'];
};

export type BookingTimeInput = {
  start: Scalars['String'];
  end: Scalars['String'];
  isAvailable: Scalars['Boolean'];
};

export type BookingTimes = {
  __typename?: 'BookingTimes';
  monday?: Maybe<BookingTime>;
  tuesday?: Maybe<BookingTime>;
  wednesday?: Maybe<BookingTime>;
  thursday?: Maybe<BookingTime>;
  friday?: Maybe<BookingTime>;
  saturday?: Maybe<BookingTime>;
  sunday?: Maybe<BookingTime>;
};

export type BookingTimesInput = {
  monday?: Maybe<BookingTimeInput>;
  tuesday?: Maybe<BookingTimeInput>;
  wednesday?: Maybe<BookingTimeInput>;
  thursday?: Maybe<BookingTimeInput>;
  friday?: Maybe<BookingTimeInput>;
  saturday?: Maybe<BookingTimeInput>;
  sunday?: Maybe<BookingTimeInput>;
};

export type CalendarEvent = {
  __typename?: 'CalendarEvent';
  kind?: Maybe<Scalars['String']>;
  etag?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  htmlLink?: Maybe<Scalars['String']>;
  created?: Maybe<Scalars['String']>;
  updated?: Maybe<Scalars['String']>;
  summary?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  colorId?: Maybe<Scalars['String']>;
  creator?: Maybe<Scalars['String']>;
  organizer?: Maybe<Scalars['String']>;
  start?: Maybe<Scalars['DateTime']>;
  end?: Maybe<Scalars['DateTime']>;
  eventType?: Maybe<Scalars['String']>;
  attendees?: Maybe<Array<Maybe<Attendees>>>;
  location?: Maybe<Scalars['String']>;
  onlineMeeting?: Maybe<Scalars['String']>;
  reminderMinutesBeforeStart?: Maybe<Scalars['Int']>;
  subject?: Maybe<Scalars['String']>;
  level?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
};

export type CalendarInputs = {
  debut: Scalars['DateTime'];
  fin: Scalars['DateTime'];
};

export type CalendarTypes =
  | 'APPLE_CALENDAR'
  | 'GOOGLE';

export type ChangePasswordInput = {
  email: Scalars['String'];
  newPassword: Scalars['String'];
};

export type CompleteIncomingMessage = {
  __typename?: 'CompleteIncomingMessage';
  userId: Scalars['String'];
  incomingEmails?: Maybe<Array<Maybe<IncomingEmail>>>;
};

export type Contact = {
  __typename?: 'Contact';
  displayName: Scalars['String'];
  emailAddresses: Array<Maybe<Scalars['String']>>;
};

export type DateInputs = {
  debut: Scalars['DateTime'];
  fin: Scalars['DateTime'];
};


export type EmailToTrainTheModelInput = {
  object?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
};

export type EmailToTrainTheModelType = {
  __typename?: 'EmailToTrainTheModelType';
  id: Scalars['String'];
  object?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
};

export type EmailUserInfo = {
  __typename?: 'EmailUserInfo';
  emailAddress: Scalars['String'];
  name: Scalars['String'];
};

export type GetMailInputs = {
  maxResult: Scalars['Int'];
};

export type GetUserMail = {
  __typename?: 'GetUserMail';
  cc?: Maybe<Array<Maybe<Scalars['String']>>>;
  content?: Maybe<Scalars['String']>;
  htmlBody?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  isRead?: Maybe<Scalars['Boolean']>;
  object?: Maybe<Scalars['String']>;
  receivedDateTime?: Maybe<Scalars['String']>;
  recipients?: Maybe<Array<Maybe<Scalars['String']>>>;
  subject?: Maybe<Scalars['String']>;
  sender?: Maybe<SenderType>;
};

export type IncomingEmail = {
  __typename?: 'IncomingEmail';
  id: Scalars['String'];
  receivedDateTime: Scalars['DateTime'];
  object: Scalars['String'];
  content: Scalars['String'];
  isRead: Scalars['Boolean'];
  cc?: Maybe<Array<Maybe<Scalars['String']>>>;
  recipients: Array<Maybe<Scalars['String']>>;
  sender: EmailUserInfo;
  htmlBody?: Maybe<Scalars['String']>;
};

export type IncomingMeetingRequestInput = {
  mailId: Scalars['String'];
  typeMail?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  sender?: Maybe<Scalars['String']>;
  recipients?: Maybe<Scalars['String']>;
  object?: Maybe<Scalars['String']>;
  senderFullName?: Maybe<Scalars['String']>;
  contents?: Maybe<Scalars['String']>;
  messageId?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
  dateEntity?: Maybe<Scalars['String']>;
  appointmentStatus?: Maybe<Scalars['String']>;
  appointmentUserAction?: Maybe<Scalars['String']>;
  eventId?: Maybe<Scalars['String']>;
  htmlBody?: Maybe<Scalars['String']>;
  GMT: Scalars['Int'];
  receivedDatetime: Scalars['String'];
  sheduleId?: Maybe<Scalars['String']>;
  schedulePriority?: Maybe<Scalars['String']>;
};

export type IncomingMeetingRequestType = {
  __typename?: 'IncomingMeetingRequestType';
  updatedAt?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['String']>;
  typeMail?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  sender?: Maybe<Scalars['String']>;
  recipients?: Maybe<Scalars['String']>;
  object?: Maybe<Scalars['String']>;
  senderFullName?: Maybe<Scalars['String']>;
  contents?: Maybe<Scalars['String']>;
  messageId?: Maybe<Scalars['String']>;
  dateEntity?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
  appointmentStatus?: Maybe<Scalars['String']>;
  appointmentUserAction?: Maybe<Scalars['String']>;
  eventId?: Maybe<Scalars['String']>;
  htmlBody?: Maybe<Scalars['String']>;
  GMT: Scalars['Int'];
  createdAt?: Maybe<Scalars['DateTime']>;
  sheduleId?: Maybe<Scalars['String']>;
  schedulePriority?: Maybe<Scalars['String']>;
};

export type IncomingRequestInput = {
  mailId: Scalars['String'];
  typeMail?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  sender?: Maybe<Scalars['String']>;
  recipients?: Maybe<Scalars['String']>;
  object?: Maybe<Scalars['String']>;
  senderFullName?: Maybe<Scalars['String']>;
  contents?: Maybe<Scalars['String']>;
  dateEntity?: Maybe<Scalars['String']>;
  appointmentStatus?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
  appointmentUserAction?: Maybe<Scalars['String']>;
  eventId?: Maybe<Scalars['String']>;
  htmlBody?: Maybe<Scalars['String']>;
  GMT: Scalars['Int'];
  receivedDatetime: Scalars['String'];
  sheduleId?: Maybe<Scalars['String']>;
  schedulePriority?: Maybe<Scalars['String']>;
};

export type IncomingRequestType = {
  __typename?: 'IncomingRequestType';
  updatedAt?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['String']>;
  typeMail?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  sender?: Maybe<Scalars['String']>;
  recipients?: Maybe<Scalars['String']>;
  object?: Maybe<Scalars['String']>;
  senderFullName?: Maybe<Scalars['String']>;
  contents?: Maybe<Scalars['String']>;
  dateEntity?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
  appointmentStatus?: Maybe<Scalars['String']>;
  appointmentUserAction?: Maybe<Scalars['String']>;
  eventId?: Maybe<Scalars['String']>;
  htmlBody?: Maybe<Scalars['String']>;
  GMT: Scalars['Int'];
  createdAt?: Maybe<Scalars['DateTime']>;
  sheduleId?: Maybe<Scalars['String']>;
  schedulePriority?: Maybe<Scalars['String']>;
};

export type InvitedUserInfo = {
  __typename?: 'InvitedUserInfo';
  email: Scalars['String'];
  required: Scalars['Boolean'];
};

export type Localisation = {
  visioConf: Scalars['Boolean'];
  location: Scalars['String'];
};

export type Location = {
  __typename?: 'Location';
  visioConf: Scalars['Boolean'];
  location: Scalars['String'];
};

export type MailService =
  | 'GOOGLE'
  | 'MICROSOFT';

export type MailServiceAuthInputs = {
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
  tokenExpiryDateTime: Scalars['String'];
};

export type Matching = {
  __typename?: 'Matching';
  busy: Scalars['Boolean'];
  eventId?: Maybe<Scalars['String']>;
};

export type MatchingDate = {
  __typename?: 'MatchingDate';
  start: Scalars['String'];
  end: Scalars['String'];
};

export type MatchingInputs = {
  userInvited?: Maybe<Array<Scalars['String']>>;
  typeMail: Scalars['Int'];
  date: DateInputs;
  newDate?: Maybe<DateInputs>;
  location?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['Int']>;
};

export type MatchingList = {
  __typename?: 'MatchingList';
  busy: Scalars['Boolean'];
  Date?: Maybe<MatchingDate>;
  eventId?: Maybe<Scalars['String']>;
};

export type MatchingListInputs = {
  userInvited?: Maybe<Array<Scalars['String']>>;
  typeMail: Scalars['Int'];
  dateList: Array<DateInputs>;
  newDate?: Maybe<Array<Maybe<DateInputs>>>;
  location?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['Int']>;
  UTC?: Maybe<Scalars['Int']>;
  mailId: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addAddress?: Maybe<AddressType>;
  updateAddress?: Maybe<AddressType>;
  removeAddress?: Maybe<AddressType>;
  signUp?: Maybe<AuthUser>;
  singupFromBO: Scalars['Boolean'];
  login?: Maybe<AuthUser>;
  loginBO?: Maybe<AuthUserBo>;
  changePassword?: Maybe<User>;
  resetPassword?: Maybe<SuccessReturn>;
  forgotPassword?: Maybe<SuccessReturn>;
  checkExpiredToken?: Maybe<SuccessReturn>;
  updateProfile?: Maybe<User>;
  updatePassword?: Maybe<User>;
  updateUserBO?: Maybe<Scalars['Boolean']>;
  revokeNotificationToken?: Maybe<Scalars['Boolean']>;
  addNotificationToken?: Maybe<Scalars['String']>;
  outlookAppointmentScheduler?: Maybe<Scalars['Boolean']>;
  removeEventByEventId?: Maybe<SuccessReturn>;
  AppointmentsScheduler?: Maybe<Array<Maybe<TimeSlot>>>;
  getUserMail?: Maybe<Array<Maybe<GetUserMail>>>;
  removeEvent?: Maybe<Scalars['Boolean']>;
  refusalMail?: Maybe<SuccessReturn>;
  acceptMail?: Maybe<SuccessReturn>;
  addIncomingRequest?: Maybe<Array<Maybe<IncomingRequestType>>>;
  deleteIncomingRequest?: Maybe<IncomingRequestType>;
  updateIncomingRequest?: Maybe<SuccessReturn>;
  updateIncomingRequestReceveidDateTimeMutation?: Maybe<Scalars['Boolean']>;
  addIncomingMeetingRequest?: Maybe<Array<Maybe<IncomingMeetingRequestType>>>;
  createTask?: Maybe<Task>;
  deleteIncomingMeetingRequest?: Maybe<IncomingMeetingRequestType>;
  updateIncomingMeetingRequest?: Maybe<SuccessReturn>;
  updateIncomingMeetingRequestReceveidDateTimeMutation?: Maybe<Scalars['Boolean']>;
  deleteTask?: Maybe<Task>;
  matching?: Maybe<Matching>;
  matchingList?: Maybe<MatchingList>;
  createOauth?: Maybe<Oauth>;
  updateAuth?: Maybe<Scalars['String']>;
  generateAccessToken?: Maybe<GenerateAccessTokenType>;
  updateSchedule?: Maybe<Schedule>;
  removeSchedule?: Maybe<Schedule>;
  TimeSLotRequest?: Maybe<Array<Maybe<TimeSlot>>>;
  saveUserFCMToken?: Maybe<Scalars['Boolean']>;
  updateStatus?: Maybe<Scalars['Boolean']>;
  deleteUserInBO?: Maybe<Scalars['Boolean']>;
  deleteUserAccount?: Maybe<SuccessReturn>;
  updateUserMode?: Maybe<User>;
  subscriptionValidation?: Maybe<UserBo>;
  createUserPreference?: Maybe<UserPreference>;
  updateTask?: Maybe<Task>;
  updateUserPreference?: Maybe<UserPreference>;
  addEmailToTrainTheModel?: Maybe<Scalars['Boolean']>;
  createUserBookingLink?: Maybe<Scalars['String']>;
};


export type MutationAddAddressArgs = {
  input: AddressInput;
};


export type MutationUpdateAddressArgs = {
  id: Scalars['String'];
  input: AddressInput;
};


export type MutationRemoveAddressArgs = {
  id: Scalars['String'];
  input: AddressInput;
};


export type MutationSignUpArgs = {
  userInput: UserCreateInput;
};


export type MutationSingupFromBoArgs = {
  userInputBO: UserFromBoInput;
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  deviceToken?: Maybe<Scalars['String']>;
};


export type MutationLoginBoArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationCheckExpiredTokenArgs = {
  email: Scalars['String'];
  token: Scalars['String'];
};
export type MutationCreateTaskArgs = {
  data: TaskInput;
};


export type MutationUpdateProfileArgs = {
  id: Scalars['String'];
  input: UserProfileInput;
};


export type MutationUpdatePasswordArgs = {
  id: Scalars['String'];
  oldPassword: Scalars['String'];
  newPassword: Scalars['String'];
};


export type MutationUpdateUserBoArgs = {
  id: Scalars['String'];
  newEmail?: Maybe<Scalars['String']>;
  newPassword?: Maybe<Scalars['String']>;
};


export type MutationRevokeNotificationTokenArgs = {
  token: Scalars['String'];
};


export type MutationAddNotificationTokenArgs = {
  userId: Scalars['String'];
  token: Scalars['String'];
};
export type MutationDeleteTaskArgs = {
  id: Scalars['String']['input'];
};


export type MutationOutlookAppointmentSchedulerArgs = {
  appointmentsInputs: AppointmentsShedulerInput;
};


export type MutationRemoveEventByEventIdArgs = {
  eventId: Scalars['String'];
  userId: Scalars['String'];
  GMT: Scalars['Int'];
};


export type MutationAppointmentsSchedulerArgs = {
  appointmentsInput: AppointmentsShedulerInput;
};


export type MutationGetUserMailArgs = {
  data?: Maybe<GetMailInputs>;
};


export type MutationRemoveEventArgs = {
  data: RemoveEventInputs;
};


export type MutationRefusalMailArgs = {
  data: RefusalMailInput;
};


export type MutationAcceptMailArgs = {
  input: AcceptMailInput;
};


export type MutationAddIncomingRequestArgs = {
  inputs?: Maybe<Array<Maybe<IncomingRequestInput>>>;
};


export type MutationDeleteIncomingRequestArgs = {
  incomingRequestId: Scalars['String'];
};


export type MutationUpdateIncomingRequestArgs = {
  inputs: UpdateIncomingRequestInput;
};


export type MutationUpdateIncomingRequestReceveidDateTimeMutationArgs = {
  data: UpdateIncomingRequestReceveidDateTimeInputs;
};


export type MutationAddIncomingMeetingRequestArgs = {
  inputs?: Maybe<Array<Maybe<IncomingMeetingRequestInput>>>;
};


export type MutationDeleteIncomingMeetingRequestArgs = {
  incomingRequestId: Scalars['String'];
};


export type MutationUpdateIncomingMeetingRequestArgs = {
  inputs: UpdateIncomingMeetingRequestInput;
};


export type MutationUpdateIncomingMeetingRequestReceveidDateTimeMutationArgs = {
  data: UpdateIncomingMeetingRequestReceveidDateTimeInputs;
};


export type MutationMatchingArgs = {
  data: MatchingInputs;
};


export type MutationMatchingListArgs = {
  data: MatchingListInputs;
};


export type MutationCreateOauthArgs = {
  data: OauthInput;
};


export type MutationUpdateAuthArgs = {
  data: OauthUpdateInput;
};


export type MutationGenerateAccessTokenArgs = {
  code: Scalars['String'];
};


export type MutationUpdateScheduleArgs = {
  id: Scalars['String'];
  data: UpdateScheduleInputs;
};


export type MutationRemoveScheduleArgs = {
  scheduleId: Scalars['String'];
};


export type MutationTimeSLotRequestArgs = {
  data: TimeSlotInput;
};


export type MutationSaveUserFcmTokenArgs = {
  userId: Scalars['String'];
  token: Scalars['String'];
};


export type MutationUpdateStatusArgs = {
  userId: Scalars['String'];
  isActive: Scalars['Boolean'];
};


export type MutationDeleteUserInBoArgs = {
  userId: Scalars['String'];
};


export type MutationDeleteUserAccountArgs = {
  userId: Scalars['String'];
};


export type MutationUpdateUserModeArgs = {
  userId: Scalars['String'];
  modeFree: Scalars['Boolean'];
  beginModeFree: Scalars['String'];
};


export type MutationSubscriptionValidationArgs = {
  free: Scalars['Boolean'];
};


export type MutationCreateUserPreferenceArgs = {
  input: UserPreferenceInputs;
};


export type MutationUpdateUserPreferenceArgs = {
  id: Scalars['String'];
  input: UserPreferenceInputs;
};
export type MutationUpdateTaskArgs = {
  data: TaskInput;
  id: Scalars['String']['input'];
};


export type MutationAddEmailToTrainTheModelArgs = {
  input?: Maybe<Array<Maybe<EmailToTrainTheModelInput>>>;
};


export type MutationCreateUserBookingLinkArgs = {
  data?: Maybe<BookingLinkInput>;
};

export type Oauth = {
  __typename?: 'Oauth';
  id: Scalars['ID'];
  email?: Maybe<Scalars['String']>;
  access_token?: Maybe<Scalars['String']>;
};

export type OauthInput = {
  email: Scalars['String'];
  access_token: Scalars['String'];
};

export type OauthUpdateInput = {
  email: Scalars['String'];
  token?: Maybe<Scalars['String']>;
  refreshToken?: Maybe<Scalars['String']>;
  tokenExpiryDateTime?: Maybe<Scalars['String']>;
};

export type OutUsersAll = {
  __typename?: 'OutUsersAll';
  users: Array<Maybe<User>>;
  length: Scalars['Int'];
};

export type OutlookEmail = {
  __typename?: 'OutlookEmail';
  isRead: Scalars['Boolean'];
  bodyPreview: Scalars['String'];
  id: Scalars['String'];
  sender?: Maybe<OutlookEmailAdress>;
  toRecipients?: Maybe<Array<Maybe<OutlookEmailAdress>>>;
  subject: Scalars['String'];
};

export type OutlookEmailAdress = {
  __typename?: 'OutlookEmailAdress';
  name?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  getUserAddresses?: Maybe<Array<Maybe<AddressType>>>;
  getAddressById?: Maybe<AddressType>;
  getEventList?: Maybe<Array<Maybe<CalendarEvent>>>;
  getRooms?: Maybe<Array<Maybe<RoomsData>>>;
  getAllUserTasks?: Maybe<Array<Maybe<Task>>>;
  getEventById?: Maybe<CalendarEvent>;
  getIncomingRequests?: Maybe<Array<Maybe<IncomingRequestType>>>;
  getIncomingMeetingRequests?: Maybe<Array<Maybe<IncomingMeetingRequestType>>>;
  getConnectedUserEmails?: Maybe<Array<Maybe<OutlookEmail>>>;
  getSchedule?: Maybe<Schedule>;
  getAllSchedules?: Maybe<Array<Maybe<Schedules>>>;
  getScheduleByUserAndEventId?: Maybe<Schedules>;
  me?: Maybe<User>;
  meBO?: Maybe<UserBo>;
  getAllUser?: Maybe<OutUsersAll>;
  getAllCompany?: Maybe<Array<Maybe<User>>>;
  getUserPreferences?: Maybe<UserPreference>;
  getTaskById?: Maybe<Task>;
  getUserBookingPreferences?: Maybe<UserBookingLinkPreference>;
  getUserContacts?: Maybe<Array<Maybe<UserContact>>>;
};


export type QueryGetUserAddressesArgs = {
  userId: Scalars['String'];
};


export type QueryGetAddressByIdArgs = {
  id: Scalars['String'];
};


export type QueryGetEventListArgs = {
  calendarInputs: CalendarInputs;
};


export type QueryGetRoomsArgs = {
  getRoomsInputs?: Maybe<GetRoomsInputs>;
};


export type QueryGetEventByIdArgs = {
  id: Scalars['String'];
};


export type QueryGetIncomingRequestsArgs = {
  userId: Scalars['String'];
};


export type QueryGetIncomingMeetingRequestsArgs = {
  userId: Scalars['String'];
};


export type QueryGetScheduleArgs = {
  id: Scalars['String'];
};


export type QueryGetAllSchedulesArgs = {
  userId: Scalars['String'];
};


export type QueryGetScheduleByUserAndEventIdArgs = {
  eventId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type QueryGetAllUserArgs = {
  offset?: Maybe<Scalars['Int']>;
  limite?: Maybe<Scalars['Int']>;
  keySearch?: Maybe<Scalars['String']>;
  keyFilterCompany?: Maybe<Scalars['String']>;
  keyFilterActive?: Maybe<Scalars['Boolean']>;
};
export type QueryGetTaskByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetUserPreferencesArgs = {
  userId: Scalars['String'];
};


export type QueryGetUserBookingPreferencesArgs = {
  userId: Scalars['String'];
};


export type QueryGetUserContactsArgs = {
  userId: Scalars['String'];
};

export type RefusalMailInput = {
  id: Scalars['String'];
  appointmentUserAction: Scalars['String'];
  emailPayload: Scalars['String'];
};

export type ResetPasswordInput = {
  token: Scalars['String'];
  email: Scalars['String'];
  newPassword: Scalars['String'];
};

export type RoomsData = {
  __typename?: 'RoomsData';
  resourcesId?: Maybe<Scalars['String']>;
  resourceName?: Maybe<Scalars['String']>;
  resourceType?: Maybe<Scalars['String']>;
  generatedResourceName?: Maybe<Scalars['String']>;
  resourceEmail?: Maybe<Scalars['String']>;
  capacity?: Maybe<Scalars['Int']>;
  buildingId?: Maybe<Scalars['String']>;
  resourceCategory?: Maybe<Scalars['String']>;
};

export type Schedule = {
  __typename?: 'Schedule';
  id: Scalars['String'];
  duration: Scalars['Int'];
  email: Scalars['String'];
  debut: Scalars['DateTime'];
  fin: Scalars['DateTime'];
  objet: Scalars['String'];
  sujet?: Maybe<Scalars['String']>;
  niveau?: Maybe<Scalars['String']>;
  localisation?: Maybe<Scalars['String']>;
  buildingId?: Maybe<Scalars['String']>;
  addressId?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
  userInvited?: Maybe<Array<Maybe<InvitedUserInfo>>>;
  GMT: Scalars['Int'];
  visioConf: Scalars['Boolean'];
  createdAt?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type Schedules = {
  __typename?: 'Schedules';
  id: Scalars['String'];
  duration: Scalars['Int'];
  email: Scalars['String'];
  debut: Scalars['DateTime'];
  fin: Scalars['DateTime'];
  acceptedSlot?: Maybe<Scalars['DateTime']>;
  objet: Scalars['String'];
  sujet?: Maybe<Scalars['String']>;
  niveau?: Maybe<Scalars['String']>;
  localisation?: Maybe<Scalars['String']>;
  buildingId?: Maybe<Scalars['String']>;
  addressId?: Maybe<Scalars['String']>;
  userInvited?: Maybe<Array<Maybe<InvitedUserInfo>>>;
  visioConf: Scalars['Boolean'];
  type: Scalars['String'];
  status: Scalars['String'];
  reminder: Scalars['String'];
  personNumber: Scalars['Int'];
  eventId?: Maybe<Scalars['String']>;
  messageId?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
  confirmedMessageId?: Maybe<Scalars['String']>;
  usertoken?: Maybe<Scalars['String']>;
  creationDate?: Maybe<Scalars['String']>;
};

export type SenderType = {
  __typename?: 'SenderType';
  emailAddress?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type SheduleType = {
  __typename?: 'SheduleType';
  start?: Maybe<Scalars['DateTime']>;
  end?: Maybe<Scalars['DateTime']>;
  duration?: Maybe<Scalars['Int']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  newIncomingEmail?: Maybe<CompleteIncomingMessage>;
};


export type SubscriptionNewIncomingEmailArgs = {
  userId: Scalars['String']['input'];
};

export type SubtaskInput = {
  assignedTo: Scalars['String']['input'];
  deadline: Scalars['String']['input'];
  duration: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
  participants: Scalars['String']['input'];
  priority: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type SuccessReturn = {
  __typename?: 'SuccessReturn';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type Task = {
  __typename?: 'Task';
  assignedTo?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  deadline: Scalars['String']['output'];
  duration: Scalars['Int']['output'];
  endDate?: Maybe<Scalars['String']['output']>;
  endTime?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  mode: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  parentTaskId?: Maybe<Scalars['String']['output']>;
  participants?: Maybe<Scalars['String']['output']>;
  priority?: Maybe<Scalars['String']['output']>;
  progress?: Maybe<Scalars['Int']['output']>;
  scheduleId?: Maybe<Scalars['String']['output']>;
  startDate?: Maybe<Scalars['String']['output']>;
  startTime?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  subtasks?: Maybe<Array<Maybe<Task>>>;
  tag?: Maybe<Scalars['String']['output']>;
  timezone?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type TaskInput = {
  assignedTo: Scalars['String']['input'];
  deadline: Scalars['String']['input'];
  duration: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
  mode: Scalars['String']['input'];
  participants: Scalars['String']['input'];
  priority: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
  subtasks?: InputMaybe<Array<SubtaskInput>>;
  tag: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type TimeSlot = {
  __typename?: 'TimeSlot';
  start?: Maybe<Scalars['DateTime']>;
  end?: Maybe<Scalars['DateTime']>;
};

export type TimeSlotInput = {
  mail: Scalars['String'];
  date: Scalars['String'];
};

export type TimeSlotList = {
  __typename?: 'TimeSlotList';
  TimeList?: Maybe<Array<Maybe<TimeSlot>>>;
};

export type UpdateIncomingMeetingRequestInput = {
  id: Scalars['String'];
  appointmentUserAction: Scalars['String'];
};

export type UpdateIncomingMeetingRequestReceveidDateTimeInputs = {
  receivedDateTime: Scalars['String'];
  mailId: Scalars['String'];
};

export type UpdateIncomingRequestInput = {
  id: Scalars['String'];
  appointmentUserAction: Scalars['String'];
};

export type UpdateIncomingRequestReceveidDateTimeInputs = {
  receivedDateTime: Scalars['String'];
  mailId: Scalars['String'];
};

export type UpdateScheduleInputs = {
  userInvited?: Maybe<Array<Maybe<UserInfoInput>>>;
  duration?: Maybe<Scalars['Int']>;
  email?: Maybe<Scalars['String']>;
  debut?: Maybe<Scalars['DateTime']>;
  fin?: Maybe<Scalars['DateTime']>;
  objet?: Maybe<Scalars['String']>;
  sujet?: Maybe<Scalars['String']>;
  niveau?: Maybe<Scalars['String']>;
  localisation?: Maybe<Localisation>;
  buildingId?: Maybe<Scalars['String']>;
  addressId?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
  reminder?: Maybe<Scalars['String']>;
  UTC?: Maybe<Scalars['Int']>;
  template?: Maybe<Scalars['String']>;
  fullName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
  timezone?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  role?: Maybe<UserRole>;
  isAdmin?: Maybe<Scalars['Boolean']>;
  isRemoved?: Maybe<Scalars['Boolean']>;
  isBanned?: Maybe<Scalars['Boolean']>;
  mailService?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
  contacts?: Maybe<Array<Maybe<Contact>>>;
  signupCompleted?: Maybe<Scalars['Boolean']>;
  isSingupBO?: Maybe<Scalars['Boolean']>;
  isActive?: Maybe<Scalars['Boolean']>;
  isPayed?: Maybe<Scalars['Boolean']>;
  modeFree?: Maybe<Scalars['Boolean']>;
  beginModeFree?: Maybe<Scalars['DateTime']>;
  calendarType?: Maybe<Scalars['String']>;
  oauthStatus?: Maybe<Scalars['String']>;
};

export type UserBo = {
  __typename?: 'UserBO';
  id: Scalars['ID'];
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
};

export type UserBookingLinkPreference = {
  __typename?: 'UserBookingLinkPreference';
  language?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['Int']>;
  level?: Maybe<Scalars['String']>;
  expirationDuration?: Maybe<Scalars['Int']>;
  bookingTimes?: Maybe<Scalars['String']>;
};

export type UserContact = {
  __typename?: 'UserContact';
  displayName: Scalars['String'];
  emailAddresses: Array<Maybe<Scalars['String']>>;
};

export type UserCreateInput = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  mailService: MailService;
  calendarType: CalendarTypes;
  mailServiceAuth: MailServiceAuthInputs;
  notificationToken: Scalars['String'];
  id?: Maybe<Scalars['String']>;
  timezone?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
  signupCompleted?: Maybe<Scalars['Boolean']>;
};

export type UserFromBo = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  company: Scalars['String'];
};

export type UserFromBoInput = {
  input: Array<Maybe<UserFromBo>>;
};

export type UserInfoInput = {
  email: Scalars['String'];
  required: Scalars['Boolean'];
};

export type UserPreference = {
  __typename?: 'UserPreference';
  id: Scalars['ID'];
  workingDays?: Maybe<Scalars['String']>;
  workingHoursBegin?: Maybe<Scalars['DateTime']>;
  workingHoursEnd?: Maybe<Scalars['DateTime']>;
  pauseHours?: Maybe<Scalars['String']>;
  highCanRescheduleLow?: Maybe<Scalars['Boolean']>;
  highCanRescheduleMedium?: Maybe<Scalars['Boolean']>;
  highCanSkipPauseTimes?: Maybe<Scalars['Boolean']>;
  highCanExtendWorkingTimes?: Maybe<Scalars['Boolean']>;
  hightWorkingHoursBegin?: Maybe<Scalars['DateTime']>;
  highWorkingHoursEnd?: Maybe<Scalars['DateTime']>;
  mediumCanRescheduleLow?: Maybe<Scalars['Boolean']>;
  mediumCanSkipPauseTimes?: Maybe<Scalars['Boolean']>;
  mediumCanExtendWorkingHours?: Maybe<Scalars['Boolean']>;
  mediumWorkingHoursBegin?: Maybe<Scalars['DateTime']>;
  mediumWorkingHoursEnd?: Maybe<Scalars['DateTime']>;
  userId?: Maybe<Scalars['String']>;
  waitngResponseTimeForHIM?: Maybe<Scalars['Int']>;
  waitngResponseTimeForMIM?: Maybe<Scalars['Int']>;
  waitngResponseTimeForLIM?: Maybe<Scalars['Int']>;
  averageTravelTime?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type UserPreferenceInputs = {
  workingDays: Scalars['String'];
  workingHoursBegin: Scalars['DateTime'];
  workingHoursEnd: Scalars['DateTime'];
  pauseHours: Scalars['String'];
  highCanRescheduleLow: Scalars['Boolean'];
  highCanRescheduleMedium: Scalars['Boolean'];
  highCanSkipPauseTimes: Scalars['Boolean'];
  highCanExtendWorkingTimes: Scalars['Boolean'];
  hightWorkingHoursBegin: Scalars['DateTime'];
  highWorkingHoursEnd: Scalars['DateTime'];
  mediumCanRescheduleLow: Scalars['Boolean'];
  mediumCanSkipPauseTimes: Scalars['Boolean'];
  mediumCanExtendWorkingHours: Scalars['Boolean'];
  mediumWorkingHoursBegin: Scalars['DateTime'];
  mediumWorkingHoursEnd: Scalars['DateTime'];
  userId: Scalars['String'];
  waitngResponseTimeForHIM: Scalars['Int'];
  waitngResponseTimeForMIM: Scalars['Int'];
  waitngResponseTimeForLIM: Scalars['Int'];
  averageTravelTime: Scalars['Int'];
  createdAt?: Maybe<Scalars['DateTime']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type UserProfileInput = {
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
};

export type UserRole =
  | 'ADMIN'
  | 'USER';

export type GenerateAccessTokenInput = {
  serverAuthCode: Scalars['String'];
};

export type GenerateAccessTokenType = {
  __typename?: 'generateAccessTokenType';
  token: Scalars['String'];
  refresh_token: Scalars['String'];
  token_type: Scalars['String'];
  expiry_date: Scalars['DateTime'];
};

export type GetRoomsInputs = {
  maxResults?: Maybe<Scalars['Int']>;
};

export type NotificationUpdateInput = {
  email: Scalars['String'];
  token: Scalars['String'];
};

export type RemoveEventInputs = {
  eventId: Scalars['String'];
  email: Scalars['String'];
};

export type UserInfosFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'isAdmin' | 'email' | 'firstName' | 'lastName' | 'mailService' | 'modeFree' | 'beginModeFree' | 'isSingupBO' | 'isActive' | 'isPayed' | 'calendarType' | 'oauthStatus'>
  & { contacts?: Maybe<Array<Maybe<(
    { __typename?: 'Contact' }
    & Pick<Contact, 'displayName' | 'emailAddresses'>
  )>>> }
);

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  deviceToken?: Maybe<Scalars['String']>;
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login?: Maybe<(
    { __typename?: 'AuthUser' }
    & Pick<AuthUser, 'token' | 'completedSignUp'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName' | 'email' | 'lastName' | 'modeFree' | 'beginModeFree' | 'isActive' | 'isPayed' | 'oauthStatus'>
    ) }
  )> }
);

export type UpdateUserProfileMutationVariables = Exact<{
  id: Scalars['String'];
  input: UserProfileInput;
}>;


export type UpdateUserProfileMutation = (
  { __typename?: 'Mutation' }
  & { updateProfile?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstName' | 'lastName'>
  )> }
);

export type CreateUserBookingLinkMutationVariables = Exact<{
  data: BookingLinkInput;
}>;


export type CreateUserBookingLinkMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'createUserBookingLink'>
);

export type Appointments_ShedulerMutationVariables = Exact<{
  appointmentsInput: AppointmentsShedulerInput;
}>;


export type Appointments_ShedulerMutation = (
  { __typename?: 'Mutation' }
  & { AppointmentsScheduler?: Maybe<Array<Maybe<(
    { __typename?: 'TimeSlot' }
    & Pick<TimeSlot, 'start' | 'end'>
  )>>> }
);

export type SignUpMutationVariables = Exact<{
  userInput: UserCreateInput;
}>;


export type SignUpMutation = (
  { __typename?: 'Mutation' }
  & { signUp?: Maybe<(
    { __typename?: 'AuthUser' }
    & Pick<AuthUser, 'token'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'isSingupBO'>
    ) }
  )> }
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & { forgotPassword?: Maybe<(
    { __typename?: 'SuccessReturn' }
    & Pick<SuccessReturn, 'success' | 'message'>
  )> }
);

export type CheckExpiredTokenMutationVariables = Exact<{
  email: Scalars['String'];
  token: Scalars['String'];
}>;


export type CheckExpiredTokenMutation = (
  { __typename?: 'Mutation' }
  & { checkExpiredToken?: Maybe<(
    { __typename?: 'SuccessReturn' }
    & Pick<SuccessReturn, 'success' | 'message'>
  )> }
);

export type ResetPasswordMutationVariables = Exact<{
  resetPasswordInput: ResetPasswordInput;
}>;


export type ResetPasswordMutation = (
  { __typename?: 'Mutation' }
  & { resetPassword?: Maybe<(
    { __typename?: 'SuccessReturn' }
    & Pick<SuccessReturn, 'success' | 'message'>
  )> }
);

export type UpdateAuthMutationVariables = Exact<{
  oauthUpdateInput: OauthUpdateInput;
}>;


export type UpdateAuthMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'updateAuth'>
);

export type GenerateAccessTokenMutationVariables = Exact<{
  code: Scalars['String'];
}>;


export type GenerateAccessTokenMutation = (
  { __typename?: 'Mutation' }
  & { generateAccessToken?: Maybe<(
    { __typename?: 'generateAccessTokenType' }
    & Pick<GenerateAccessTokenType, 'token' | 'refresh_token' | 'expiry_date' | 'token_type'>
  )> }
);

export type RevokeNotificationTokenMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type RevokeNotificationTokenMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'revokeNotificationToken'>
);

export type AddNotificationTokenMutationVariables = Exact<{
  userId: Scalars['String'];
  token: Scalars['String'];
}>;


export type AddNotificationTokenMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'addNotificationToken'>
);

export type RemoveAddressMutationVariables = Exact<{
  id: Scalars['String'];
  input: AddressInput;
}>;


export type RemoveAddressMutation = (
  { __typename?: 'Mutation' }
  & { removeAddress?: Maybe<(
    { __typename?: 'AddressType' }
    & Pick<AddressType, 'id' | 'libelle' | 'adresse' | 'isRemoved' | 'userId'>
  )> }
);

export type UpdateAddressMutationVariables = Exact<{
  id: Scalars['String'];
  input: AddressInput;
}>;


export type UpdateAddressMutation = (
  { __typename?: 'Mutation' }
  & { updateAddress?: Maybe<(
    { __typename?: 'AddressType' }
    & Pick<AddressType, 'id' | 'libelle' | 'adresse' | 'isRemoved' | 'userId'>
  )> }
);

export type AddAddressMutationVariables = Exact<{
  input: AddressInput;
}>;


export type AddAddressMutation = (
  { __typename?: 'Mutation' }
  & { addAddress?: Maybe<(
    { __typename?: 'AddressType' }
    & Pick<AddressType, 'libelle' | 'adresse' | 'id' | 'isRemoved' | 'userId'>
  )> }
);

export type RefusalMailMutationVariables = Exact<{
  data: RefusalMailInput;
}>;


export type RefusalMailMutation = (
  { __typename?: 'Mutation' }
  & { refusalMail?: Maybe<(
    { __typename?: 'SuccessReturn' }
    & Pick<SuccessReturn, 'success'>
  )> }
);

export type AcceptMailMutationVariables = Exact<{
  input: AcceptMailInput;
}>;


export type AcceptMailMutation = (
  { __typename?: 'Mutation' }
  & { acceptMail?: Maybe<(
    { __typename?: 'SuccessReturn' }
    & Pick<SuccessReturn, 'success'>
  )> }
);

export type UpdateUserPreferenceMutationVariables = Exact<{
  id: Scalars['String'];
  input: UserPreferenceInputs;
}>;


export type UpdateUserPreferenceMutation = (
  { __typename?: 'Mutation' }
  & { updateUserPreference?: Maybe<(
    { __typename?: 'UserPreference' }
    & Pick<UserPreference, 'averageTravelTime' | 'workingDays' | 'userId'>
  )> }
);

export type CreateUserPreferenceMutationVariables = Exact<{
  input: UserPreferenceInputs;
}>;


export type CreateUserPreferenceMutation = (
  { __typename?: 'Mutation' }
  & { createUserPreference?: Maybe<(
    { __typename?: 'UserPreference' }
    & Pick<UserPreference, 'userId' | 'workingHoursBegin'>
  )> }
);

export type AddIncomingRequestMutationVariables = Exact<{
  inputs: Array<Maybe<IncomingRequestInput>> | Maybe<IncomingRequestInput>;
}>;


export type AddIncomingRequestMutation = (
  { __typename?: 'Mutation' }
  & { addIncomingRequest?: Maybe<Array<Maybe<(
    { __typename?: 'IncomingRequestType' }
    & Pick<IncomingRequestType, 'id' | 'typeMail' | 'location' | 'sender' | 'recipients' | 'object' | 'senderFullName' | 'contents' | 'dateEntity' | 'userId' | 'appointmentStatus' | 'appointmentUserAction' | 'GMT' | 'htmlBody' | 'sheduleId' | 'schedulePriority'>
  )>>> }
);

export type SaveUserFcmTokenMutationVariables = Exact<{
  userId: Scalars['String'];
  token: Scalars['String'];
}>;


export type SaveUserFcmTokenMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'saveUserFCMToken'>
);

export type MatchingResolversMutationVariables = Exact<{
  data: MatchingInputs;
}>;


export type MatchingResolversMutation = (
  { __typename?: 'Mutation' }
  & { matching?: Maybe<(
    { __typename?: 'Matching' }
    & Pick<Matching, 'busy' | 'eventId'>
  )> }
);

export type DeleteIncomingRequestMutationVariables = Exact<{
  incomingRequestId: Scalars['String'];
}>;


export type DeleteIncomingRequestMutation = (
  { __typename?: 'Mutation' }
  & { deleteIncomingRequest?: Maybe<(
    { __typename?: 'IncomingRequestType' }
    & Pick<IncomingRequestType, 'id' | 'typeMail' | 'location' | 'sender' | 'recipients' | 'object' | 'senderFullName' | 'contents' | 'dateEntity' | 'userId' | 'appointmentStatus' | 'appointmentUserAction'>
  )> }
);

export type RemoveScheduleMutationVariables = Exact<{
  scheduleId: Scalars['String'];
}>;


export type RemoveScheduleMutation = (
  { __typename?: 'Mutation' }
  & { removeSchedule?: Maybe<(
    { __typename?: 'Schedule' }
    & Pick<Schedule, 'debut' | 'GMT' | 'duration' | 'email' | 'fin' | 'id' | 'objet' | 'localisation' | 'niveau' | 'sujet' | 'visioConf'>
    & { userInvited?: Maybe<Array<Maybe<(
      { __typename?: 'InvitedUserInfo' }
      & Pick<InvitedUserInfo, 'email' | 'required'>
    )>>> }
  )> }
);

export type UpdateIncomingRequestMutationVariables = Exact<{
  inputs: UpdateIncomingRequestInput;
}>;


export type UpdateIncomingRequestMutation = (
  { __typename?: 'Mutation' }
  & { updateIncomingRequest?: Maybe<(
    { __typename?: 'SuccessReturn' }
    & Pick<SuccessReturn, 'success' | 'message'>
  )> }
);

export type GetMailUserMutationVariables = Exact<{
  data?: Maybe<GetMailInputs>;
}>;


export type GetMailUserMutation = (
  { __typename?: 'Mutation' }
  & { getUserMail?: Maybe<Array<Maybe<(
    { __typename?: 'GetUserMail' }
    & Pick<GetUserMail, 'cc' | 'id' | 'content' | 'htmlBody' | 'isRead' | 'object' | 'receivedDateTime' | 'recipients' | 'subject'>
    & { sender?: Maybe<(
      { __typename?: 'SenderType' }
      & Pick<SenderType, 'emailAddress' | 'name'>
    )> }
  )>>> }
);

export type RemoveEventByEventIdMutationVariables = Exact<{
  eventId: Scalars['String'];
  userId: Scalars['String'];
  GMT: Scalars['Int'];
}>;


export type RemoveEventByEventIdMutation = (
  { __typename?: 'Mutation' }
  & { removeEventByEventId?: Maybe<(
    { __typename?: 'SuccessReturn' }
    & Pick<SuccessReturn, 'success' | 'message'>
  )> }
);

export type UpdateIncomingRequestReceveidDateTimeMutationMutationVariables = Exact<{
  data: UpdateIncomingRequestReceveidDateTimeInputs;
}>;


export type UpdateIncomingRequestReceveidDateTimeMutationMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'updateIncomingRequestReceveidDateTimeMutation'>
);

export type MatchingListMutationVariables = Exact<{
  data: MatchingListInputs;
}>;


export type MatchingListMutation = (
  { __typename?: 'Mutation' }
  & { matchingList?: Maybe<(
    { __typename?: 'MatchingList' }
    & Pick<MatchingList, 'busy' | 'eventId'>
    & { Date?: Maybe<(
      { __typename?: 'MatchingDate' }
      & Pick<MatchingDate, 'start' | 'end'>
    )> }
  )> }
);

export type Update_User_ModeMutationVariables = Exact<{
  userId: Scalars['String'];
  modeFree: Scalars['Boolean'];
  beginModeFree: Scalars['String'];
}>;


export type Update_User_ModeMutation = (
  { __typename?: 'Mutation' }
  & { updateUserMode?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'modeFree' | 'beginModeFree'>
  )> }
);

export type SubmcheckMutationVariables = Exact<{
  free: Scalars['Boolean'];
}>;


export type SubmcheckMutation = (
  { __typename?: 'Mutation' }
  & { subscriptionValidation?: Maybe<(
    { __typename?: 'UserBO' }
    & Pick<UserBo, 'id' | 'firstName' | 'lastName' | 'email'>
  )> }
);

export type AddEmailToTrainTheModelMutationVariables = Exact<{
  inputs: Array<Maybe<EmailToTrainTheModelInput>> | Maybe<EmailToTrainTheModelInput>;
}>;


export type AddEmailToTrainTheModelMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'addEmailToTrainTheModel'>
);
export type CreateTaskMutationVariables = Exact<{
  data: TaskInput;
}>;


export type CreateTaskMutation = { __typename?: 'Mutation', createTask?: { __typename?: 'Task', id: string, title: string, mode: string, duration: number, tag?: string | null, status?: string | null, notes?: string | null, timezone?: string | null, startTime?: string | null, endTime?: string | null, deadline: string, assignedTo?: string | null, endDate?: string | null, participants?: string | null, priority?: string | null, startDate?: string | null, parentTaskId?: string | null, progress?: number | null, updatedAt?: string | null, createdAt?: string | null, userId?: string | null, scheduleId?: string | null } | null };

export type UpdateTaskMutationVariables = Exact<{
  id: Scalars['String']['input'];
  data: TaskInput;
}>;


export type UpdateTaskMutation = { __typename?: 'Mutation', updateTask?: { __typename?: 'Task', id: string, title: string, mode: string, duration: number, tag?: string | null, status?: string | null, notes?: string | null, timezone?: string | null, startTime?: string | null, endTime?: string | null, deadline: string, assignedTo?: string | null, endDate?: string | null, participants?: string | null, priority?: string | null, startDate?: string | null, parentTaskId?: string | null, progress?: number | null, updatedAt?: string | null, createdAt?: string | null, userId?: string | null, scheduleId?: string | null } | null };

export type DeleteTaskMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteTaskMutation = { __typename?: 'Mutation', deleteTask?: { __typename?: 'Task', id: string, title: string, mode: string, duration: number, tag?: string | null, status?: string | null, notes?: string | null, timezone?: string | null, startTime?: string | null, endTime?: string | null, deadline: string, assignedTo?: string | null, endDate?: string | null, participants?: string | null, priority?: string | null, startDate?: string | null, parentTaskId?: string | null, progress?: number | null, updatedAt?: string | null, createdAt?: string | null, userId?: string | null, scheduleId?: string | null } | null };

export type GetUserProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserProfileQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & UserInfosFragment
  )> }
);

export type GetAllUserAddressesQueryVariables = Exact<{
  userId: Scalars['String'];
}>;


export type GetAllUserAddressesQuery = (
  { __typename?: 'Query' }
  & { getUserAddresses?: Maybe<Array<Maybe<(
    { __typename?: 'AddressType' }
    & Pick<AddressType, 'id' | 'libelle' | 'adresse' | 'isRemoved' | 'defaultAddress' | 'fromRemote'>
  )>>> }
);

export type GetAddressByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetAddressByIdQuery = (
  { __typename?: 'Query' }
  & { getAddressById?: Maybe<(
    { __typename?: 'AddressType' }
    & Pick<AddressType, 'id' | 'libelle' | 'adresse' | 'isRemoved' | 'userId'>
  )> }
);

export type GetUserPreferencesByIdQueryVariables = Exact<{
  userId: Scalars['String'];
}>;


export type GetUserPreferencesByIdQuery = (
  { __typename?: 'Query' }
  & { getUserPreferences?: Maybe<(
    { __typename?: 'UserPreference' }
    & Pick<UserPreference, 'id' | 'workingDays' | 'workingHoursBegin' | 'workingHoursEnd' | 'pauseHours' | 'highCanRescheduleLow' | 'highCanRescheduleMedium' | 'highCanSkipPauseTimes' | 'highCanExtendWorkingTimes' | 'hightWorkingHoursBegin' | 'highWorkingHoursEnd' | 'mediumCanRescheduleLow' | 'mediumCanSkipPauseTimes' | 'mediumCanExtendWorkingHours' | 'mediumWorkingHoursBegin' | 'mediumWorkingHoursEnd' | 'userId' | 'waitngResponseTimeForHIM' | 'waitngResponseTimeForMIM' | 'waitngResponseTimeForLIM' | 'averageTravelTime'>
  )> }
);

export type GetIncomingRequestsByUserIdQueryVariables = Exact<{
  userId: Scalars['String'];
}>;


export type GetIncomingRequestsByUserIdQuery = (
  { __typename?: 'Query' }
  & { getIncomingRequests?: Maybe<Array<Maybe<(
    { __typename?: 'IncomingRequestType' }
    & Pick<IncomingRequestType, 'id' | 'typeMail' | 'location' | 'sender' | 'recipients' | 'object' | 'senderFullName' | 'contents' | 'dateEntity' | 'userId' | 'appointmentStatus' | 'appointmentUserAction' | 'htmlBody' | 'createdAt' | 'sheduleId' | 'schedulePriority'>
  )>>> }
);

export type GetScheduleQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetScheduleQuery = (
  { __typename?: 'Query' }
  & { getSchedule?: Maybe<(
    { __typename?: 'Schedule' }
    & Pick<Schedule, 'id' | 'duration' | 'email' | 'debut' | 'fin' | 'objet' | 'sujet' | 'niveau' | 'localisation' | 'GMT' | 'visioConf' | 'lang'>
    & { userInvited?: Maybe<Array<Maybe<(
      { __typename?: 'InvitedUserInfo' }
      & Pick<InvitedUserInfo, 'email' | 'required'>
    )>>> }
  )> }
);

export type GetEventListQueryVariables = Exact<{
  input: CalendarInputs;
}>;


export type GetEventListQuery = (
  { __typename?: 'Query' }
  & { getEventList?: Maybe<Array<Maybe<(
    { __typename?: 'CalendarEvent' }
    & Pick<CalendarEvent, 'created' | 'creator' | 'description' | 'end' | 'etag' | 'eventType' | 'htmlLink' | 'id' | 'kind' | 'location' | 'organizer' | 'start' | 'status' | 'updated' | 'level'>
    & { color: CalendarEvent['colorId'], title: CalendarEvent['summary'] }
    & { attendees?: Maybe<Array<Maybe<(
      { __typename?: 'Attendees' }
      & Pick<Attendees, 'email' | 'responseStatus'>
    )>>> }
  )>>> }
);

export type GetRoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRoomsQuery = (
  { __typename?: 'Query' }
  & { getRooms?: Maybe<Array<Maybe<(
    { __typename?: 'RoomsData' }
    & Pick<RoomsData, 'resourcesId' | 'resourceName' | 'resourceType' | 'generatedResourceName' | 'resourceEmail' | 'capacity' | 'buildingId' | 'resourceCategory'>
  )>>> }
);

export type GetEventByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetEventByIdQuery = (
  { __typename?: 'Query' }
  & { getEventById?: Maybe<(
    { __typename?: 'CalendarEvent' }
    & Pick<CalendarEvent, 'id' | 'kind' | 'etag' | 'status' | 'htmlLink' | 'reminderMinutesBeforeStart' | 'onlineMeeting' | 'description' | 'start' | 'end' | 'location' | 'creator' | 'organizer' | 'summary' | 'level'>
    & { attendees?: Maybe<Array<Maybe<(
      { __typename?: 'Attendees' }
      & Pick<Attendees, 'email' | 'responseStatus' | 'name'>
    )>>> }
  )> }
);

export type GetAllUserSchedulesQueryVariables = Exact<{
  userId: Scalars['String'];
}>;


export type GetAllUserSchedulesQuery = (
  { __typename?: 'Query' }
  & { getAllSchedules?: Maybe<Array<Maybe<(
    { __typename?: 'Schedules' }
    & Pick<Schedules, 'id' | 'duration' | 'email' | 'objet' | 'sujet' | 'niveau' | 'localisation' | 'visioConf' | 'type' | 'status' | 'personNumber' | 'acceptedSlot' | 'reminder' | 'eventId' | 'debut' | 'fin' | 'creationDate'>
    & { userInvited?: Maybe<Array<Maybe<(
      { __typename?: 'InvitedUserInfo' }
      & Pick<InvitedUserInfo, 'email' | 'required'>
    )>>> }
  )>>> }
);

export type GetScheduleByUserAndEventIdQueryVariables = Exact<{
  userId: Scalars['String'];
  eventId: Scalars['String'];
}>;


export type GetScheduleByUserAndEventIdQuery = (
  { __typename?: 'Query' }
  & { getScheduleByUserAndEventId?: Maybe<(
    { __typename?: 'Schedules' }
    & Pick<Schedules, 'id' | 'duration' | 'email' | 'objet' | 'sujet' | 'niveau' | 'localisation' | 'visioConf' | 'type' | 'status' | 'personNumber' | 'acceptedSlot' | 'reminder' | 'eventId' | 'debut' | 'fin' | 'creationDate'>
    & { userInvited?: Maybe<Array<Maybe<(
      { __typename?: 'InvitedUserInfo' }
      & Pick<InvitedUserInfo, 'email' | 'required'>
    )>>> }
  )> }
);

export type GetUserBookingLinkPreferencesQueryVariables = Exact<{
  userId: Scalars['String'];
}>;


export type GetUserBookingLinkPreferencesQuery = (
  { __typename?: 'Query' }
  & { getUserBookingPreferences?: Maybe<(
    { __typename?: 'UserBookingLinkPreference' }
    & Pick<UserBookingLinkPreference, 'language' | 'duration' | 'level' | 'expirationDuration' | 'bookingTimes'>
  )> }
);

export type GetUserContactQueryVariables = Exact<{
  userId: Scalars['String'];
}>;


export type GetUserContactQuery = (
  { __typename?: 'Query' }
  & { getUserContacts?: Maybe<Array<Maybe<(
    { __typename?: 'UserContact' }
    & Pick<UserContact, 'displayName' | 'emailAddresses'>
  )>>> }
);

export type GetAllUserTasksQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GetAllUserTasksQuery = { __typename?: 'Query', getAllUserTasks?: Array<{ __typename?: 'Task', id: string, duration: number, tag?: string | null, status?: string | null, notes?: string | null, timezone?: string | null, startTime?: string | null, endTime?: string | null, deadline: string, title: string, mode: string, assignedTo?: string | null, participants?: string | null, endDate?: string | null, priority?: string | null, startDate?: string | null, parentTaskId?: string | null, progress?: number | null, updatedAt?: string | null, createdAt?: string | null, userId?: string | null, scheduleId?: string | null, subtasks?: Array<{ __typename?: 'Task', id: string, duration: number, tag?: string | null, status?: string | null, notes?: string | null, timezone?: string | null, startTime?: string | null, endTime?: string | null, deadline: string, title: string, assignedTo?: string | null, participants?: string | null, endDate?: string | null, priority?: string | null, startDate?: string | null, parentTaskId?: string | null, progress?: number | null, updatedAt?: string | null, createdAt?: string | null, userId?: string | null, scheduleId?: string | null } | null> | null } | null> | null };

export type GetTaskByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetTaskByIdQuery = { __typename?: 'Query', getTaskById?: { __typename?: 'Task', id: string, duration: number, tag?: string | null, status?: string | null, notes?: string | null, timezone?: string | null, startTime?: string | null, endTime?: string | null, deadline: string, title: string, assignedTo?: string | null, participants?: string | null, endDate?: string | null, priority?: string | null, startDate?: string | null, parentTaskId?: string | null, progress?: number | null, updatedAt?: string | null, createdAt?: string | null, userId?: string | null, scheduleId?: string | null } | null };

export type NewIncomingEmailSubscriptionVariables = Exact<{
  userId: Scalars['String'];
}>;


export type NewIncomingEmailSubscription = (
  { __typename?: 'Subscription' }
  & { newIncomingEmail?: Maybe<(
    { __typename?: 'CompleteIncomingMessage' }
    & Pick<CompleteIncomingMessage, 'userId'>
    & { incomingEmails?: Maybe<Array<Maybe<(
      { __typename?: 'IncomingEmail' }
      & Pick<IncomingEmail, 'id' | 'receivedDateTime' | 'object' | 'content' | 'isRead' | 'cc' | 'recipients' | 'htmlBody'>
      & { sender: (
        { __typename?: 'EmailUserInfo' }
        & Pick<EmailUserInfo, 'emailAddress' | 'name'>
      ) }
    )>>> }
  )> }
);

export const UserInfosFragmentDoc = gql`
    fragment userInfos on User {
  id
  isAdmin
  email
  firstName
  lastName
  mailService
  contacts {
    displayName
    emailAddresses
  }
  modeFree
  beginModeFree
  isSingupBO
  isActive
  isPayed
  calendarType
  lang
  oauthStatus
}
    `;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!, $deviceToken: String!) {
  login(email: $email, password: $password, deviceToken: $deviceToken) {
    token
    user {
      id
      firstName
      email
      lastName
      email
      modeFree
      beginModeFree
      isActive
      isPayed
    }
    completedSignUp
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const UpdateUserProfileDocument = gql`
    mutation UpdateUserProfile($id: String!, $input: UserProfileInput!) {
  updateProfile(id: $id, input: $input) {
    id
    firstName
    lastName
  }
}
    `;
export type UpdateUserProfileMutationFn = Apollo.MutationFunction<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;

/**
 * __useUpdateUserProfileMutation__
 *
 * To run a mutation, you first call `useUpdateUserProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserProfileMutation, { data, loading, error }] = useUpdateUserProfileMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>(UpdateUserProfileDocument, options);
      }
export type UpdateUserProfileMutationHookResult = ReturnType<typeof useUpdateUserProfileMutation>;
export type UpdateUserProfileMutationResult = Apollo.MutationResult<UpdateUserProfileMutation>;
export type UpdateUserProfileMutationOptions = Apollo.BaseMutationOptions<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;
export const CreateUserBookingLinkDocument = gql`
    mutation CreateUserBookingLink($data: BookingLinkInput!) {
  createUserBookingLink(data: $data)
}
    `;
export type CreateUserBookingLinkMutationFn = Apollo.MutationFunction<CreateUserBookingLinkMutation, CreateUserBookingLinkMutationVariables>;

/**
 * __useCreateUserBookingLinkMutation__
 *
 * To run a mutation, you first call `useCreateUserBookingLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserBookingLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserBookingLinkMutation, { data, loading, error }] = useCreateUserBookingLinkMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateUserBookingLinkMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserBookingLinkMutation, CreateUserBookingLinkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserBookingLinkMutation, CreateUserBookingLinkMutationVariables>(CreateUserBookingLinkDocument, options);
      }
export type CreateUserBookingLinkMutationHookResult = ReturnType<typeof useCreateUserBookingLinkMutation>;
export type CreateUserBookingLinkMutationResult = Apollo.MutationResult<CreateUserBookingLinkMutation>;
export type CreateUserBookingLinkMutationOptions = Apollo.BaseMutationOptions<CreateUserBookingLinkMutation, CreateUserBookingLinkMutationVariables>;
export const Appointments_ShedulerDocument = gql`
    mutation Appointments_Sheduler($appointmentsInput: AppointmentsShedulerInput!) {
  AppointmentsScheduler(appointmentsInput: $appointmentsInput) {
    start
    end
  }
}
    `;
export type Appointments_ShedulerMutationFn = Apollo.MutationFunction<Appointments_ShedulerMutation, Appointments_ShedulerMutationVariables>;

/**
 * __useAppointments_ShedulerMutation__
 *
 * To run a mutation, you first call `useAppointments_ShedulerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAppointments_ShedulerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [appointmentsShedulerMutation, { data, loading, error }] = useAppointments_ShedulerMutation({
 *   variables: {
 *      appointmentsInput: // value for 'appointmentsInput'
 *   },
 * });
 */
export function useAppointments_ShedulerMutation(baseOptions?: Apollo.MutationHookOptions<Appointments_ShedulerMutation, Appointments_ShedulerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Appointments_ShedulerMutation, Appointments_ShedulerMutationVariables>(Appointments_ShedulerDocument, options);
      }
export type Appointments_ShedulerMutationHookResult = ReturnType<typeof useAppointments_ShedulerMutation>;
export type Appointments_ShedulerMutationResult = Apollo.MutationResult<Appointments_ShedulerMutation>;
export type Appointments_ShedulerMutationOptions = Apollo.BaseMutationOptions<Appointments_ShedulerMutation, Appointments_ShedulerMutationVariables>;
export const SignUpDocument = gql`
    mutation SignUp($userInput: UserCreateInput!) {
  signUp(userInput: $userInput) {
    user {
      id
      isSingupBO
    }
    token
  }
}
    `;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      userInput: // value for 'userInput'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, options);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email) {
    success
    message
  }
}
    `;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, options);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const CheckExpiredTokenDocument = gql`
    mutation CheckExpiredToken($email: String!, $token: String!) {
  checkExpiredToken(email: $email, token: $token) {
    success
    message
  }
}
    `;
export type CheckExpiredTokenMutationFn = Apollo.MutationFunction<CheckExpiredTokenMutation, CheckExpiredTokenMutationVariables>;

/**
 * __useCheckExpiredTokenMutation__
 *
 * To run a mutation, you first call `useCheckExpiredTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCheckExpiredTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [checkExpiredTokenMutation, { data, loading, error }] = useCheckExpiredTokenMutation({
 *   variables: {
 *      email: // value for 'email'
 *      token: // value for 'token'
 *   },
 * });
 */
export function useCheckExpiredTokenMutation(baseOptions?: Apollo.MutationHookOptions<CheckExpiredTokenMutation, CheckExpiredTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CheckExpiredTokenMutation, CheckExpiredTokenMutationVariables>(CheckExpiredTokenDocument, options);
      }
export type CheckExpiredTokenMutationHookResult = ReturnType<typeof useCheckExpiredTokenMutation>;
export type CheckExpiredTokenMutationResult = Apollo.MutationResult<CheckExpiredTokenMutation>;
export type CheckExpiredTokenMutationOptions = Apollo.BaseMutationOptions<CheckExpiredTokenMutation, CheckExpiredTokenMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation ResetPassword($resetPasswordInput: ResetPasswordInput!) {
  resetPassword(input: $resetPasswordInput) {
    success
    message
  }
}
    `;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      resetPasswordInput: // value for 'resetPasswordInput'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const UpdateAuthDocument = gql`
    mutation UpdateAuth($oauthUpdateInput: OauthUpdateInput!) {
  updateAuth(data: $oauthUpdateInput)
}
    `;
export type UpdateAuthMutationFn = Apollo.MutationFunction<UpdateAuthMutation, UpdateAuthMutationVariables>;

/**
 * __useUpdateAuthMutation__
 *
 * To run a mutation, you first call `useUpdateAuthMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAuthMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAuthMutation, { data, loading, error }] = useUpdateAuthMutation({
 *   variables: {
 *      oauthUpdateInput: // value for 'oauthUpdateInput'
 *   },
 * });
 */
export function useUpdateAuthMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAuthMutation, UpdateAuthMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAuthMutation, UpdateAuthMutationVariables>(UpdateAuthDocument, options);
      }
export type UpdateAuthMutationHookResult = ReturnType<typeof useUpdateAuthMutation>;
export type UpdateAuthMutationResult = Apollo.MutationResult<UpdateAuthMutation>;
export type UpdateAuthMutationOptions = Apollo.BaseMutationOptions<UpdateAuthMutation, UpdateAuthMutationVariables>;
export const GenerateAccessTokenDocument = gql`
    mutation GenerateAccessToken($code: String!) {
  generateAccessToken(code: $code) {
    token
    refresh_token
    expiry_date
    token_type
  }
}
    `;
export type GenerateAccessTokenMutationFn = Apollo.MutationFunction<GenerateAccessTokenMutation, GenerateAccessTokenMutationVariables>;

/**
 * __useGenerateAccessTokenMutation__
 *
 * To run a mutation, you first call `useGenerateAccessTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateAccessTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateAccessTokenMutation, { data, loading, error }] = useGenerateAccessTokenMutation({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useGenerateAccessTokenMutation(baseOptions?: Apollo.MutationHookOptions<GenerateAccessTokenMutation, GenerateAccessTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GenerateAccessTokenMutation, GenerateAccessTokenMutationVariables>(GenerateAccessTokenDocument, options);
      }
export type GenerateAccessTokenMutationHookResult = ReturnType<typeof useGenerateAccessTokenMutation>;
export type GenerateAccessTokenMutationResult = Apollo.MutationResult<GenerateAccessTokenMutation>;
export type GenerateAccessTokenMutationOptions = Apollo.BaseMutationOptions<GenerateAccessTokenMutation, GenerateAccessTokenMutationVariables>;
export const RevokeNotificationTokenDocument = gql`
    mutation RevokeNotificationToken($token: String!) {
  revokeNotificationToken(token: $token)
}
    `;
export type RevokeNotificationTokenMutationFn = Apollo.MutationFunction<RevokeNotificationTokenMutation, RevokeNotificationTokenMutationVariables>;

/**
 * __useRevokeNotificationTokenMutation__
 *
 * To run a mutation, you first call `useRevokeNotificationTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRevokeNotificationTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [revokeNotificationTokenMutation, { data, loading, error }] = useRevokeNotificationTokenMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useRevokeNotificationTokenMutation(baseOptions?: Apollo.MutationHookOptions<RevokeNotificationTokenMutation, RevokeNotificationTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RevokeNotificationTokenMutation, RevokeNotificationTokenMutationVariables>(RevokeNotificationTokenDocument, options);
      }
export type RevokeNotificationTokenMutationHookResult = ReturnType<typeof useRevokeNotificationTokenMutation>;
export type RevokeNotificationTokenMutationResult = Apollo.MutationResult<RevokeNotificationTokenMutation>;
export type RevokeNotificationTokenMutationOptions = Apollo.BaseMutationOptions<RevokeNotificationTokenMutation, RevokeNotificationTokenMutationVariables>;
export const AddNotificationTokenDocument = gql`
    mutation AddNotificationToken($userId: String!, $token: String!) {
  addNotificationToken(userId: $userId, token: $token)
}
    `;
export type AddNotificationTokenMutationFn = Apollo.MutationFunction<AddNotificationTokenMutation, AddNotificationTokenMutationVariables>;

/**
 * __useAddNotificationTokenMutation__
 *
 * To run a mutation, you first call `useAddNotificationTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddNotificationTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addNotificationTokenMutation, { data, loading, error }] = useAddNotificationTokenMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      token: // value for 'token'
 *   },
 * });
 */
export function useAddNotificationTokenMutation(baseOptions?: Apollo.MutationHookOptions<AddNotificationTokenMutation, AddNotificationTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddNotificationTokenMutation, AddNotificationTokenMutationVariables>(AddNotificationTokenDocument, options);
      }
export type AddNotificationTokenMutationHookResult = ReturnType<typeof useAddNotificationTokenMutation>;
export type AddNotificationTokenMutationResult = Apollo.MutationResult<AddNotificationTokenMutation>;
export type AddNotificationTokenMutationOptions = Apollo.BaseMutationOptions<AddNotificationTokenMutation, AddNotificationTokenMutationVariables>;
export const RemoveAddressDocument = gql`
    mutation RemoveAddress($id: String!, $input: AddressInput!) {
  removeAddress(id: $id, input: $input) {
    id
    libelle
    adresse
    isRemoved
    userId
  }
}
    `;
export type RemoveAddressMutationFn = Apollo.MutationFunction<RemoveAddressMutation, RemoveAddressMutationVariables>;

/**
 * __useRemoveAddressMutation__
 *
 * To run a mutation, you first call `useRemoveAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeAddressMutation, { data, loading, error }] = useRemoveAddressMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRemoveAddressMutation(baseOptions?: Apollo.MutationHookOptions<RemoveAddressMutation, RemoveAddressMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveAddressMutation, RemoveAddressMutationVariables>(RemoveAddressDocument, options);
      }
export type RemoveAddressMutationHookResult = ReturnType<typeof useRemoveAddressMutation>;
export type RemoveAddressMutationResult = Apollo.MutationResult<RemoveAddressMutation>;
export type RemoveAddressMutationOptions = Apollo.BaseMutationOptions<RemoveAddressMutation, RemoveAddressMutationVariables>;
export const UpdateAddressDocument = gql`
    mutation UpdateAddress($id: String!, $input: AddressInput!) {
  updateAddress(id: $id, input: $input) {
    id
    libelle
    adresse
    isRemoved
    userId
  }
}
    `;
export type UpdateAddressMutationFn = Apollo.MutationFunction<UpdateAddressMutation, UpdateAddressMutationVariables>;

/**
 * __useUpdateAddressMutation__
 *
 * To run a mutation, you first call `useUpdateAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAddressMutation, { data, loading, error }] = useUpdateAddressMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAddressMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAddressMutation, UpdateAddressMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAddressMutation, UpdateAddressMutationVariables>(UpdateAddressDocument, options);
      }
export type UpdateAddressMutationHookResult = ReturnType<typeof useUpdateAddressMutation>;
export type UpdateAddressMutationResult = Apollo.MutationResult<UpdateAddressMutation>;
export type UpdateAddressMutationOptions = Apollo.BaseMutationOptions<UpdateAddressMutation, UpdateAddressMutationVariables>;
export const AddAddressDocument = gql`
    mutation AddAddress($input: AddressInput!) {
  addAddress(input: $input) {
    libelle
    adresse
    id
    isRemoved
    userId
  }
}
    `;
export type AddAddressMutationFn = Apollo.MutationFunction<AddAddressMutation, AddAddressMutationVariables>;

/**
 * __useAddAddressMutation__
 *
 * To run a mutation, you first call `useAddAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addAddressMutation, { data, loading, error }] = useAddAddressMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddAddressMutation(baseOptions?: Apollo.MutationHookOptions<AddAddressMutation, AddAddressMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddAddressMutation, AddAddressMutationVariables>(AddAddressDocument, options);
      }
export type AddAddressMutationHookResult = ReturnType<typeof useAddAddressMutation>;
export type AddAddressMutationResult = Apollo.MutationResult<AddAddressMutation>;
export type AddAddressMutationOptions = Apollo.BaseMutationOptions<AddAddressMutation, AddAddressMutationVariables>;
export const RefusalMailDocument = gql`
    mutation RefusalMail($data: RefusalMailInput!) {
  refusalMail(data: $data) {
    success
  }
}
    `;
export type RefusalMailMutationFn = Apollo.MutationFunction<RefusalMailMutation, RefusalMailMutationVariables>;

/**
 * __useRefusalMailMutation__
 *
 * To run a mutation, you first call `useRefusalMailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefusalMailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refusalMailMutation, { data, loading, error }] = useRefusalMailMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRefusalMailMutation(baseOptions?: Apollo.MutationHookOptions<RefusalMailMutation, RefusalMailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RefusalMailMutation, RefusalMailMutationVariables>(RefusalMailDocument, options);
      }
export type RefusalMailMutationHookResult = ReturnType<typeof useRefusalMailMutation>;
export type RefusalMailMutationResult = Apollo.MutationResult<RefusalMailMutation>;
export type RefusalMailMutationOptions = Apollo.BaseMutationOptions<RefusalMailMutation, RefusalMailMutationVariables>;
export const AcceptMailDocument = gql`
    mutation AcceptMail($input: AcceptMailInput!) {
  acceptMail(input: $input) {
    success
  }
}
    `;
export type AcceptMailMutationFn = Apollo.MutationFunction<AcceptMailMutation, AcceptMailMutationVariables>;

/**
 * __useAcceptMailMutation__
 *
 * To run a mutation, you first call `useAcceptMailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptMailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptMailMutation, { data, loading, error }] = useAcceptMailMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAcceptMailMutation(baseOptions?: Apollo.MutationHookOptions<AcceptMailMutation, AcceptMailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptMailMutation, AcceptMailMutationVariables>(AcceptMailDocument, options);
      }
export type AcceptMailMutationHookResult = ReturnType<typeof useAcceptMailMutation>;
export type AcceptMailMutationResult = Apollo.MutationResult<AcceptMailMutation>;
export type AcceptMailMutationOptions = Apollo.BaseMutationOptions<AcceptMailMutation, AcceptMailMutationVariables>;
export const UpdateUserPreferenceDocument = gql`
    mutation UpdateUserPreference($id: String!, $input: UserPreferenceInputs!) {
  updateUserPreference(id: $id, input: $input) {
    averageTravelTime
    workingDays
    userId
  }
}
    `;
export type UpdateUserPreferenceMutationFn = Apollo.MutationFunction<UpdateUserPreferenceMutation, UpdateUserPreferenceMutationVariables>;

/**
 * __useUpdateUserPreferenceMutation__
 *
 * To run a mutation, you first call `useUpdateUserPreferenceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserPreferenceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserPreferenceMutation, { data, loading, error }] = useUpdateUserPreferenceMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserPreferenceMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserPreferenceMutation, UpdateUserPreferenceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserPreferenceMutation, UpdateUserPreferenceMutationVariables>(UpdateUserPreferenceDocument, options);
      }
export type UpdateUserPreferenceMutationHookResult = ReturnType<typeof useUpdateUserPreferenceMutation>;
export type UpdateUserPreferenceMutationResult = Apollo.MutationResult<UpdateUserPreferenceMutation>;
export type UpdateUserPreferenceMutationOptions = Apollo.BaseMutationOptions<UpdateUserPreferenceMutation, UpdateUserPreferenceMutationVariables>;
export const CreateUserPreferenceDocument = gql`
    mutation CreateUserPreference($input: UserPreferenceInputs!) {
  createUserPreference(input: $input) {
    userId
    workingHoursBegin
  }
}
    `;
export type CreateUserPreferenceMutationFn = Apollo.MutationFunction<CreateUserPreferenceMutation, CreateUserPreferenceMutationVariables>;

/**
 * __useCreateUserPreferenceMutation__
 *
 * To run a mutation, you first call `useCreateUserPreferenceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserPreferenceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserPreferenceMutation, { data, loading, error }] = useCreateUserPreferenceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserPreferenceMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserPreferenceMutation, CreateUserPreferenceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserPreferenceMutation, CreateUserPreferenceMutationVariables>(CreateUserPreferenceDocument, options);
      }
export type CreateUserPreferenceMutationHookResult = ReturnType<typeof useCreateUserPreferenceMutation>;
export type CreateUserPreferenceMutationResult = Apollo.MutationResult<CreateUserPreferenceMutation>;
export type CreateUserPreferenceMutationOptions = Apollo.BaseMutationOptions<CreateUserPreferenceMutation, CreateUserPreferenceMutationVariables>;
export const AddIncomingRequestDocument = gql`
    mutation AddIncomingRequest($inputs: [IncomingRequestInput]!) {
  addIncomingRequest(inputs: $inputs) {
    id
    typeMail
    location
    sender
    recipients
    object
    senderFullName
    contents
    dateEntity
    userId
    appointmentStatus
    appointmentUserAction
    GMT
    htmlBody
    sheduleId
    schedulePriority
  }
}
    `;
export type AddIncomingRequestMutationFn = Apollo.MutationFunction<AddIncomingRequestMutation, AddIncomingRequestMutationVariables>;

/**
 * __useAddIncomingRequestMutation__
 *
 * To run a mutation, you first call `useAddIncomingRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddIncomingRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addIncomingRequestMutation, { data, loading, error }] = useAddIncomingRequestMutation({
 *   variables: {
 *      inputs: // value for 'inputs'
 *   },
 * });
 */
export function useAddIncomingRequestMutation(baseOptions?: Apollo.MutationHookOptions<AddIncomingRequestMutation, AddIncomingRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddIncomingRequestMutation, AddIncomingRequestMutationVariables>(AddIncomingRequestDocument, options);
      }
export type AddIncomingRequestMutationHookResult = ReturnType<typeof useAddIncomingRequestMutation>;
export type AddIncomingRequestMutationResult = Apollo.MutationResult<AddIncomingRequestMutation>;
export type AddIncomingRequestMutationOptions = Apollo.BaseMutationOptions<AddIncomingRequestMutation, AddIncomingRequestMutationVariables>;
export const SaveUserFcmTokenDocument = gql`
    mutation SaveUserFcmToken($userId: String!, $token: String!) {
  saveUserFCMToken(userId: $userId, token: $token)
}
    `;
export type SaveUserFcmTokenMutationFn = Apollo.MutationFunction<SaveUserFcmTokenMutation, SaveUserFcmTokenMutationVariables>;

/**
 * __useSaveUserFcmTokenMutation__
 *
 * To run a mutation, you first call `useSaveUserFcmTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveUserFcmTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveUserFcmTokenMutation, { data, loading, error }] = useSaveUserFcmTokenMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      token: // value for 'token'
 *   },
 * });
 */
export function useSaveUserFcmTokenMutation(baseOptions?: Apollo.MutationHookOptions<SaveUserFcmTokenMutation, SaveUserFcmTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveUserFcmTokenMutation, SaveUserFcmTokenMutationVariables>(SaveUserFcmTokenDocument, options);
      }
export type SaveUserFcmTokenMutationHookResult = ReturnType<typeof useSaveUserFcmTokenMutation>;
export type SaveUserFcmTokenMutationResult = Apollo.MutationResult<SaveUserFcmTokenMutation>;
export type SaveUserFcmTokenMutationOptions = Apollo.BaseMutationOptions<SaveUserFcmTokenMutation, SaveUserFcmTokenMutationVariables>;
export const MatchingResolversDocument = gql`
    mutation MatchingResolvers($data: MatchingInputs!) {
  matching(data: $data) {
    busy
    eventId
  }
}
    `;
export type MatchingResolversMutationFn = Apollo.MutationFunction<MatchingResolversMutation, MatchingResolversMutationVariables>;

/**
 * __useMatchingResolversMutation__
 *
 * To run a mutation, you first call `useMatchingResolversMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMatchingResolversMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [matchingResolversMutation, { data, loading, error }] = useMatchingResolversMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useMatchingResolversMutation(baseOptions?: Apollo.MutationHookOptions<MatchingResolversMutation, MatchingResolversMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MatchingResolversMutation, MatchingResolversMutationVariables>(MatchingResolversDocument, options);
      }
export type MatchingResolversMutationHookResult = ReturnType<typeof useMatchingResolversMutation>;
export type MatchingResolversMutationResult = Apollo.MutationResult<MatchingResolversMutation>;
export type MatchingResolversMutationOptions = Apollo.BaseMutationOptions<MatchingResolversMutation, MatchingResolversMutationVariables>;
export const DeleteIncomingRequestDocument = gql`
    mutation DeleteIncomingRequest($incomingRequestId: String!) {
  deleteIncomingRequest(incomingRequestId: $incomingRequestId) {
    id
    typeMail
    location
    sender
    recipients
    object
    senderFullName
    contents
    dateEntity
    userId
    appointmentStatus
    appointmentUserAction
  }
}
    `;
export type DeleteIncomingRequestMutationFn = Apollo.MutationFunction<DeleteIncomingRequestMutation, DeleteIncomingRequestMutationVariables>;

/**
 * __useDeleteIncomingRequestMutation__
 *
 * To run a mutation, you first call `useDeleteIncomingRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteIncomingRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteIncomingRequestMutation, { data, loading, error }] = useDeleteIncomingRequestMutation({
 *   variables: {
 *      incomingRequestId: // value for 'incomingRequestId'
 *   },
 * });
 */
export function useDeleteIncomingRequestMutation(baseOptions?: Apollo.MutationHookOptions<DeleteIncomingRequestMutation, DeleteIncomingRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteIncomingRequestMutation, DeleteIncomingRequestMutationVariables>(DeleteIncomingRequestDocument, options);
      }
export type DeleteIncomingRequestMutationHookResult = ReturnType<typeof useDeleteIncomingRequestMutation>;
export type DeleteIncomingRequestMutationResult = Apollo.MutationResult<DeleteIncomingRequestMutation>;
export type DeleteIncomingRequestMutationOptions = Apollo.BaseMutationOptions<DeleteIncomingRequestMutation, DeleteIncomingRequestMutationVariables>;
export const RemoveScheduleDocument = gql`
    mutation RemoveSchedule($scheduleId: String!) {
  removeSchedule(scheduleId: $scheduleId) {
    debut
    GMT
    duration
    email
    fin
    id
    objet
    localisation
    niveau
    sujet
    userInvited {
      email
      required
    }
    visioConf
  }
}
    `;
export type RemoveScheduleMutationFn = Apollo.MutationFunction<RemoveScheduleMutation, RemoveScheduleMutationVariables>;

/**
 * __useRemoveScheduleMutation__
 *
 * To run a mutation, you first call `useRemoveScheduleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveScheduleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeScheduleMutation, { data, loading, error }] = useRemoveScheduleMutation({
 *   variables: {
 *      scheduleId: // value for 'scheduleId'
 *   },
 * });
 */
export function useRemoveScheduleMutation(baseOptions?: Apollo.MutationHookOptions<RemoveScheduleMutation, RemoveScheduleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveScheduleMutation, RemoveScheduleMutationVariables>(RemoveScheduleDocument, options);
      }
export type RemoveScheduleMutationHookResult = ReturnType<typeof useRemoveScheduleMutation>;
export type RemoveScheduleMutationResult = Apollo.MutationResult<RemoveScheduleMutation>;
export type RemoveScheduleMutationOptions = Apollo.BaseMutationOptions<RemoveScheduleMutation, RemoveScheduleMutationVariables>;
export const UpdateIncomingRequestDocument = gql`
    mutation UpdateIncomingRequest($inputs: UpdateIncomingRequestInput!) {
  updateIncomingRequest(inputs: $inputs) {
    success
    message
  }
}
    `;
export type UpdateIncomingRequestMutationFn = Apollo.MutationFunction<UpdateIncomingRequestMutation, UpdateIncomingRequestMutationVariables>;

/**
 * __useUpdateIncomingRequestMutation__
 *
 * To run a mutation, you first call `useUpdateIncomingRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateIncomingRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateIncomingRequestMutation, { data, loading, error }] = useUpdateIncomingRequestMutation({
 *   variables: {
 *      inputs: // value for 'inputs'
 *   },
 * });
 */
export function useUpdateIncomingRequestMutation(baseOptions?: Apollo.MutationHookOptions<UpdateIncomingRequestMutation, UpdateIncomingRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateIncomingRequestMutation, UpdateIncomingRequestMutationVariables>(UpdateIncomingRequestDocument, options);
      }
export type UpdateIncomingRequestMutationHookResult = ReturnType<typeof useUpdateIncomingRequestMutation>;
export type UpdateIncomingRequestMutationResult = Apollo.MutationResult<UpdateIncomingRequestMutation>;
export type UpdateIncomingRequestMutationOptions = Apollo.BaseMutationOptions<UpdateIncomingRequestMutation, UpdateIncomingRequestMutationVariables>;
export const GetMailUserDocument = gql`
    mutation GetMailUser($data: GetMailInputs) {
  getUserMail(data: $data) {
    cc
    id
    content
    htmlBody
    isRead
    object
    receivedDateTime
    recipients
    subject
    sender {
      emailAddress
      name
    }
  }
}
    `;
export type GetMailUserMutationFn = Apollo.MutationFunction<GetMailUserMutation, GetMailUserMutationVariables>;

/**
 * __useGetMailUserMutation__
 *
 * To run a mutation, you first call `useGetMailUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGetMailUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [getMailUserMutation, { data, loading, error }] = useGetMailUserMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useGetMailUserMutation(baseOptions?: Apollo.MutationHookOptions<GetMailUserMutation, GetMailUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GetMailUserMutation, GetMailUserMutationVariables>(GetMailUserDocument, options);
      }
export type GetMailUserMutationHookResult = ReturnType<typeof useGetMailUserMutation>;
export type GetMailUserMutationResult = Apollo.MutationResult<GetMailUserMutation>;
export type GetMailUserMutationOptions = Apollo.BaseMutationOptions<GetMailUserMutation, GetMailUserMutationVariables>;
export const RemoveEventByEventIdDocument = gql`
    mutation RemoveEventByEventId($eventId: String!, $userId: String!, $GMT: Int!) {
  removeEventByEventId(eventId: $eventId, userId: $userId, GMT: $GMT) {
    success
    message
  }
}
    `;
export type RemoveEventByEventIdMutationFn = Apollo.MutationFunction<RemoveEventByEventIdMutation, RemoveEventByEventIdMutationVariables>;

/**
 * __useRemoveEventByEventIdMutation__
 *
 * To run a mutation, you first call `useRemoveEventByEventIdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveEventByEventIdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeEventByEventIdMutation, { data, loading, error }] = useRemoveEventByEventIdMutation({
 *   variables: {
 *      eventId: // value for 'eventId'
 *      userId: // value for 'userId'
 *      GMT: // value for 'GMT'
 *   },
 * });
 */
export function useRemoveEventByEventIdMutation(baseOptions?: Apollo.MutationHookOptions<RemoveEventByEventIdMutation, RemoveEventByEventIdMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveEventByEventIdMutation, RemoveEventByEventIdMutationVariables>(RemoveEventByEventIdDocument, options);
      }
export type RemoveEventByEventIdMutationHookResult = ReturnType<typeof useRemoveEventByEventIdMutation>;
export type RemoveEventByEventIdMutationResult = Apollo.MutationResult<RemoveEventByEventIdMutation>;
export type RemoveEventByEventIdMutationOptions = Apollo.BaseMutationOptions<RemoveEventByEventIdMutation, RemoveEventByEventIdMutationVariables>;
export const UpdateIncomingRequestReceveidDateTimeMutationDocument = gql`
    mutation updateIncomingRequestReceveidDateTimeMutation($data: UpdateIncomingRequestReceveidDateTimeInputs!) {
  updateIncomingRequestReceveidDateTimeMutation(data: $data)
}
    `;
export type UpdateIncomingRequestReceveidDateTimeMutationMutationFn = Apollo.MutationFunction<UpdateIncomingRequestReceveidDateTimeMutationMutation, UpdateIncomingRequestReceveidDateTimeMutationMutationVariables>;

/**
 * __useUpdateIncomingRequestReceveidDateTimeMutationMutation__
 *
 * To run a mutation, you first call `useUpdateIncomingRequestReceveidDateTimeMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateIncomingRequestReceveidDateTimeMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateIncomingRequestReceveidDateTimeMutationMutation, { data, loading, error }] = useUpdateIncomingRequestReceveidDateTimeMutationMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateIncomingRequestReceveidDateTimeMutationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateIncomingRequestReceveidDateTimeMutationMutation, UpdateIncomingRequestReceveidDateTimeMutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateIncomingRequestReceveidDateTimeMutationMutation, UpdateIncomingRequestReceveidDateTimeMutationMutationVariables>(UpdateIncomingRequestReceveidDateTimeMutationDocument, options);
      }
export type UpdateIncomingRequestReceveidDateTimeMutationMutationHookResult = ReturnType<typeof useUpdateIncomingRequestReceveidDateTimeMutationMutation>;
export type UpdateIncomingRequestReceveidDateTimeMutationMutationResult = Apollo.MutationResult<UpdateIncomingRequestReceveidDateTimeMutationMutation>;
export type UpdateIncomingRequestReceveidDateTimeMutationMutationOptions = Apollo.BaseMutationOptions<UpdateIncomingRequestReceveidDateTimeMutationMutation, UpdateIncomingRequestReceveidDateTimeMutationMutationVariables>;
export const MatchingListDocument = gql`
    mutation MatchingList($data: MatchingListInputs!) {
  matchingList(data: $data) {
    busy
    Date {
      start
      end
    }
    eventId
  }
}
    `;
export type MatchingListMutationFn = Apollo.MutationFunction<MatchingListMutation, MatchingListMutationVariables>;

/**
 * __useMatchingListMutation__
 *
 * To run a mutation, you first call `useMatchingListMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMatchingListMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [matchingListMutation, { data, loading, error }] = useMatchingListMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useMatchingListMutation(baseOptions?: Apollo.MutationHookOptions<MatchingListMutation, MatchingListMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MatchingListMutation, MatchingListMutationVariables>(MatchingListDocument, options);
      }
export type MatchingListMutationHookResult = ReturnType<typeof useMatchingListMutation>;
export type MatchingListMutationResult = Apollo.MutationResult<MatchingListMutation>;
export type MatchingListMutationOptions = Apollo.BaseMutationOptions<MatchingListMutation, MatchingListMutationVariables>;
export const Update_User_ModeDocument = gql`
    mutation UPDATE_USER_MODE($userId: String!, $modeFree: Boolean!, $beginModeFree: String!) {
  updateUserMode(
    userId: $userId
    modeFree: $modeFree
    beginModeFree: $beginModeFree
  ) {
    id
    modeFree
    beginModeFree
  }
}
    `;
export type Update_User_ModeMutationFn = Apollo.MutationFunction<Update_User_ModeMutation, Update_User_ModeMutationVariables>;

/**
 * __useUpdate_User_ModeMutation__
 *
 * To run a mutation, you first call `useUpdate_User_ModeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdate_User_ModeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserModeMutation, { data, loading, error }] = useUpdate_User_ModeMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      modeFree: // value for 'modeFree'
 *      beginModeFree: // value for 'beginModeFree'
 *   },
 * });
 */
export function useUpdate_User_ModeMutation(baseOptions?: Apollo.MutationHookOptions<Update_User_ModeMutation, Update_User_ModeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Update_User_ModeMutation, Update_User_ModeMutationVariables>(Update_User_ModeDocument, options);
      }
export type Update_User_ModeMutationHookResult = ReturnType<typeof useUpdate_User_ModeMutation>;
export type Update_User_ModeMutationResult = Apollo.MutationResult<Update_User_ModeMutation>;
export type Update_User_ModeMutationOptions = Apollo.BaseMutationOptions<Update_User_ModeMutation, Update_User_ModeMutationVariables>;
export const SubmcheckDocument = gql`
    mutation SUBMCHECK($free: Boolean!) {
  subscriptionValidation(free: $free) {
    id
    firstName
    lastName
    email
  }
}
    `;
export type SubmcheckMutationFn = Apollo.MutationFunction<SubmcheckMutation, SubmcheckMutationVariables>;

/**
 * __useSubmcheckMutation__
 *
 * To run a mutation, you first call `useSubmcheckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmcheckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submcheckMutation, { data, loading, error }] = useSubmcheckMutation({
 *   variables: {
 *      free: // value for 'free'
 *   },
 * });
 */
export function useSubmcheckMutation(baseOptions?: Apollo.MutationHookOptions<SubmcheckMutation, SubmcheckMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmcheckMutation, SubmcheckMutationVariables>(SubmcheckDocument, options);
      }
export type SubmcheckMutationHookResult = ReturnType<typeof useSubmcheckMutation>;
export type SubmcheckMutationResult = Apollo.MutationResult<SubmcheckMutation>;
export type SubmcheckMutationOptions = Apollo.BaseMutationOptions<SubmcheckMutation, SubmcheckMutationVariables>;
export const AddEmailToTrainTheModelDocument = gql`
    mutation AddEmailToTrainTheModel($inputs: [EmailToTrainTheModelInput]!) {
  addEmailToTrainTheModel(input: $inputs)
}
    `;
export type AddEmailToTrainTheModelMutationFn = Apollo.MutationFunction<AddEmailToTrainTheModelMutation, AddEmailToTrainTheModelMutationVariables>;

/**
 * __useAddEmailToTrainTheModelMutation__
 *
 * To run a mutation, you first call `useAddEmailToTrainTheModelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddEmailToTrainTheModelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addEmailToTrainTheModelMutation, { data, loading, error }] = useAddEmailToTrainTheModelMutation({
 *   variables: {
 *      inputs: // value for 'inputs'
 *   },
 * });
 */
export function useAddEmailToTrainTheModelMutation(baseOptions?: Apollo.MutationHookOptions<AddEmailToTrainTheModelMutation, AddEmailToTrainTheModelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddEmailToTrainTheModelMutation, AddEmailToTrainTheModelMutationVariables>(AddEmailToTrainTheModelDocument, options);
      }
export type AddEmailToTrainTheModelMutationHookResult = ReturnType<typeof useAddEmailToTrainTheModelMutation>;
export type AddEmailToTrainTheModelMutationResult = Apollo.MutationResult<AddEmailToTrainTheModelMutation>;
export type AddEmailToTrainTheModelMutationOptions = Apollo.BaseMutationOptions<AddEmailToTrainTheModelMutation, AddEmailToTrainTheModelMutationVariables>;
export const CreateTaskDocument = gql`
    mutation CreateTask($data: TaskInput!) {
  createTask(data: $data) {
    id
    title
    mode
    duration
    tag
    status
    notes
    timezone
    startTime
    endTime
    deadline
    assignedTo
    endDate
    participants
    priority
    startDate
    parentTaskId
    progress
    updatedAt
    createdAt
    userId
    scheduleId
  }
}
    `;
export type CreateTaskMutationFn = Apollo.MutationFunction<CreateTaskMutation, CreateTaskMutationVariables>;

/**
 * __useCreateTaskMutation__
 *
 * To run a mutation, you first call `useCreateTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTaskMutation, { data, loading, error }] = useCreateTaskMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateTaskMutation(baseOptions?: Apollo.MutationHookOptions<CreateTaskMutation, CreateTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTaskMutation, CreateTaskMutationVariables>(CreateTaskDocument, options);
      }
export type CreateTaskMutationHookResult = ReturnType<typeof useCreateTaskMutation>;
export type CreateTaskMutationResult = Apollo.MutationResult<CreateTaskMutation>;
export type CreateTaskMutationOptions = Apollo.BaseMutationOptions<CreateTaskMutation, CreateTaskMutationVariables>;
export const UpdateTaskDocument = gql`
    mutation UpdateTask($id: String!, $data: TaskInput!) {
  updateTask(id: $id, data: $data) {
    id
    title
    mode
    duration
    tag
    status
    notes
    timezone
    startTime
    endTime
    deadline
    assignedTo
    endDate
    participants
    priority
    startDate
    parentTaskId
    progress
    updatedAt
    createdAt
    userId
    scheduleId
  }
}
    `;
export type UpdateTaskMutationFn = Apollo.MutationFunction<UpdateTaskMutation, UpdateTaskMutationVariables>;

/**
 * __useUpdateTaskMutation__
 *
 * To run a mutation, you first call `useUpdateTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTaskMutation, { data, loading, error }] = useUpdateTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateTaskMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTaskMutation, UpdateTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTaskMutation, UpdateTaskMutationVariables>(UpdateTaskDocument, options);
      }
export type UpdateTaskMutationHookResult = ReturnType<typeof useUpdateTaskMutation>;
export type UpdateTaskMutationResult = Apollo.MutationResult<UpdateTaskMutation>;
export type UpdateTaskMutationOptions = Apollo.BaseMutationOptions<UpdateTaskMutation, UpdateTaskMutationVariables>;
export const DeleteTaskDocument = gql`
    mutation DeleteTask($id: String!) {
  deleteTask(id: $id) {
    id
    title
    mode
    duration
    tag
    status
    notes
    timezone
    startTime
    endTime
    deadline
    assignedTo
    endDate
    participants
    priority
    startDate
    parentTaskId
    progress
    updatedAt
    createdAt
    userId
    scheduleId
  }
}
    `;
export type DeleteTaskMutationFn = Apollo.MutationFunction<DeleteTaskMutation, DeleteTaskMutationVariables>;

/**
 * __useDeleteTaskMutation__
 *
 * To run a mutation, you first call `useDeleteTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTaskMutation, { data, loading, error }] = useDeleteTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTaskMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTaskMutation, DeleteTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTaskMutation, DeleteTaskMutationVariables>(DeleteTaskDocument, options);
      }
export type DeleteTaskMutationHookResult = ReturnType<typeof useDeleteTaskMutation>;
export type DeleteTaskMutationResult = Apollo.MutationResult<DeleteTaskMutation>;
export type DeleteTaskMutationOptions = Apollo.BaseMutationOptions<DeleteTaskMutation, DeleteTaskMutationVariables>;
export const GetUserProfileDocument = gql`
    query GetUserProfile {
  me {
    ...userInfos
  }
}
    ${UserInfosFragmentDoc}`;

/**
 * __useGetUserProfileQuery__
 *
 * To run a query within a React component, call `useGetUserProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserProfileQuery(baseOptions?: Apollo.QueryHookOptions<GetUserProfileQuery, GetUserProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserProfileQuery, GetUserProfileQueryVariables>(GetUserProfileDocument, options);
      }
export function useGetUserProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserProfileQuery, GetUserProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserProfileQuery, GetUserProfileQueryVariables>(GetUserProfileDocument, options);
        }
export type GetUserProfileQueryHookResult = ReturnType<typeof useGetUserProfileQuery>;
export type GetUserProfileLazyQueryHookResult = ReturnType<typeof useGetUserProfileLazyQuery>;
export type GetUserProfileQueryResult = Apollo.QueryResult<GetUserProfileQuery, GetUserProfileQueryVariables>;
export const GetAllUserAddressesDocument = gql`
    query getAllUserAddresses($userId: String!) {
  getUserAddresses(userId: $userId) {
    id
    libelle
    adresse
    isRemoved
    defaultAddress
    fromRemote
  }
}
    `;

/**
 * __useGetAllUserAddressesQuery__
 *
 * To run a query within a React component, call `useGetAllUserAddressesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllUserAddressesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllUserAddressesQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetAllUserAddressesQuery(baseOptions: Apollo.QueryHookOptions<GetAllUserAddressesQuery, GetAllUserAddressesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllUserAddressesQuery, GetAllUserAddressesQueryVariables>(GetAllUserAddressesDocument, options);
      }
export function useGetAllUserAddressesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllUserAddressesQuery, GetAllUserAddressesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllUserAddressesQuery, GetAllUserAddressesQueryVariables>(GetAllUserAddressesDocument, options);
        }
export type GetAllUserAddressesQueryHookResult = ReturnType<typeof useGetAllUserAddressesQuery>;
export type GetAllUserAddressesLazyQueryHookResult = ReturnType<typeof useGetAllUserAddressesLazyQuery>;
export type GetAllUserAddressesQueryResult = Apollo.QueryResult<GetAllUserAddressesQuery, GetAllUserAddressesQueryVariables>;
export const GetAddressByIdDocument = gql`
    query getAddressById($id: String!) {
  getAddressById(id: $id) {
    id
    libelle
    adresse
    isRemoved
    userId
  }
}
    `;

/**
 * __useGetAddressByIdQuery__
 *
 * To run a query within a React component, call `useGetAddressByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAddressByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAddressByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAddressByIdQuery(baseOptions: Apollo.QueryHookOptions<GetAddressByIdQuery, GetAddressByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAddressByIdQuery, GetAddressByIdQueryVariables>(GetAddressByIdDocument, options);
      }
export function useGetAddressByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAddressByIdQuery, GetAddressByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAddressByIdQuery, GetAddressByIdQueryVariables>(GetAddressByIdDocument, options);
        }
export type GetAddressByIdQueryHookResult = ReturnType<typeof useGetAddressByIdQuery>;
export type GetAddressByIdLazyQueryHookResult = ReturnType<typeof useGetAddressByIdLazyQuery>;
export type GetAddressByIdQueryResult = Apollo.QueryResult<GetAddressByIdQuery, GetAddressByIdQueryVariables>;
export const GetUserPreferencesByIdDocument = gql`
    query GetUserPreferencesById($userId: String!) {
  getUserPreferences(userId: $userId) {
    id
    workingDays
    workingHoursBegin
    workingHoursEnd
    pauseHours
    highCanRescheduleLow
    highCanRescheduleMedium
    highCanSkipPauseTimes
    highCanExtendWorkingTimes
    hightWorkingHoursBegin
    highWorkingHoursEnd
    mediumCanRescheduleLow
    mediumCanSkipPauseTimes
    mediumCanExtendWorkingHours
    mediumWorkingHoursBegin
    mediumWorkingHoursEnd
    userId
    waitngResponseTimeForHIM
    waitngResponseTimeForMIM
    waitngResponseTimeForLIM
    averageTravelTime
  }
}
    `;

/**
 * __useGetUserPreferencesByIdQuery__
 *
 * To run a query within a React component, call `useGetUserPreferencesByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserPreferencesByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserPreferencesByIdQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserPreferencesByIdQuery(baseOptions: Apollo.QueryHookOptions<GetUserPreferencesByIdQuery, GetUserPreferencesByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserPreferencesByIdQuery, GetUserPreferencesByIdQueryVariables>(GetUserPreferencesByIdDocument, options);
      }
export function useGetUserPreferencesByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserPreferencesByIdQuery, GetUserPreferencesByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserPreferencesByIdQuery, GetUserPreferencesByIdQueryVariables>(GetUserPreferencesByIdDocument, options);
        }
export type GetUserPreferencesByIdQueryHookResult = ReturnType<typeof useGetUserPreferencesByIdQuery>;
export type GetUserPreferencesByIdLazyQueryHookResult = ReturnType<typeof useGetUserPreferencesByIdLazyQuery>;
export type GetUserPreferencesByIdQueryResult = Apollo.QueryResult<GetUserPreferencesByIdQuery, GetUserPreferencesByIdQueryVariables>;
export const GetIncomingRequestsByUserIdDocument = gql`
    query GetIncomingRequestsByUserId($userId: String!) {
  getIncomingRequests(userId: $userId) {
    id
    typeMail
    location
    sender
    recipients
    object
    senderFullName
    contents
    dateEntity
    userId
    appointmentStatus
    appointmentUserAction
    htmlBody
    createdAt
    sheduleId
    schedulePriority
    lang
  }
}
    `;

/**
 * __useGetIncomingRequestsByUserIdQuery__
 *
 * To run a query within a React component, call `useGetIncomingRequestsByUserIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetIncomingRequestsByUserIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetIncomingRequestsByUserIdQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetIncomingRequestsByUserIdQuery(baseOptions: Apollo.QueryHookOptions<GetIncomingRequestsByUserIdQuery, GetIncomingRequestsByUserIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetIncomingRequestsByUserIdQuery, GetIncomingRequestsByUserIdQueryVariables>(GetIncomingRequestsByUserIdDocument, options);
      }
export function useGetIncomingRequestsByUserIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetIncomingRequestsByUserIdQuery, GetIncomingRequestsByUserIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetIncomingRequestsByUserIdQuery, GetIncomingRequestsByUserIdQueryVariables>(GetIncomingRequestsByUserIdDocument, options);
        }
export type GetIncomingRequestsByUserIdQueryHookResult = ReturnType<typeof useGetIncomingRequestsByUserIdQuery>;
export type GetIncomingRequestsByUserIdLazyQueryHookResult = ReturnType<typeof useGetIncomingRequestsByUserIdLazyQuery>;
export type GetIncomingRequestsByUserIdQueryResult = Apollo.QueryResult<GetIncomingRequestsByUserIdQuery, GetIncomingRequestsByUserIdQueryVariables>;
export const GetScheduleDocument = gql`
    query GetSchedule($id: String!) {
  getSchedule(id: $id) {
    id
    duration
    email
    debut
    fin
    objet
    sujet
    niveau
    localisation
    GMT
    userInvited {
      email
      required
    }
    visioConf
    lang
  }
}
    `;

/**
 * __useGetScheduleQuery__
 *
 * To run a query within a React component, call `useGetScheduleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetScheduleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetScheduleQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetScheduleQuery(baseOptions: Apollo.QueryHookOptions<GetScheduleQuery, GetScheduleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetScheduleQuery, GetScheduleQueryVariables>(GetScheduleDocument, options);
      }
export function useGetScheduleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetScheduleQuery, GetScheduleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetScheduleQuery, GetScheduleQueryVariables>(GetScheduleDocument, options);
        }
export type GetScheduleQueryHookResult = ReturnType<typeof useGetScheduleQuery>;
export type GetScheduleLazyQueryHookResult = ReturnType<typeof useGetScheduleLazyQuery>;
export type GetScheduleQueryResult = Apollo.QueryResult<GetScheduleQuery, GetScheduleQueryVariables>;
export const GetEventListDocument = gql`
    query GetEventList($input: CalendarInputs!) {
  getEventList(calendarInputs: $input) {
    attendees {
      email
      responseStatus
    }
    color: colorId
    created
    creator
    description
    end
    etag
    eventType
    htmlLink
    id
    kind
    location
    organizer
    start
    status
    title: summary
    updated
    level
  }
}
    `;

/**
 * __useGetEventListQuery__
 *
 * To run a query within a React component, call `useGetEventListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEventListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEventListQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetEventListQuery(baseOptions: Apollo.QueryHookOptions<GetEventListQuery, GetEventListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEventListQuery, GetEventListQueryVariables>(GetEventListDocument, options);
      }
export function useGetEventListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEventListQuery, GetEventListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEventListQuery, GetEventListQueryVariables>(GetEventListDocument, options);
        }
export type GetEventListQueryHookResult = ReturnType<typeof useGetEventListQuery>;
export type GetEventListLazyQueryHookResult = ReturnType<typeof useGetEventListLazyQuery>;
export type GetEventListQueryResult = Apollo.QueryResult<GetEventListQuery, GetEventListQueryVariables>;
export const GetRoomsDocument = gql`
    query GetRooms {
  getRooms {
    resourcesId
    resourceName
    resourceType
    generatedResourceName
    resourceEmail
    capacity
    buildingId
    resourceCategory
  }
}
    `;

/**
 * __useGetRoomsQuery__
 *
 * To run a query within a React component, call `useGetRoomsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoomsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoomsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetRoomsQuery(baseOptions?: Apollo.QueryHookOptions<GetRoomsQuery, GetRoomsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRoomsQuery, GetRoomsQueryVariables>(GetRoomsDocument, options);
      }
export function useGetRoomsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRoomsQuery, GetRoomsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRoomsQuery, GetRoomsQueryVariables>(GetRoomsDocument, options);
        }
export type GetRoomsQueryHookResult = ReturnType<typeof useGetRoomsQuery>;
export type GetRoomsLazyQueryHookResult = ReturnType<typeof useGetRoomsLazyQuery>;
export type GetRoomsQueryResult = Apollo.QueryResult<GetRoomsQuery, GetRoomsQueryVariables>;
export const GetEventByIdDocument = gql`
    query GetEventById($id: String!) {
  getEventById(id: $id) {
    id
    kind
    etag
    status
    htmlLink
    reminderMinutesBeforeStart
    onlineMeeting
    description
    start
    end
    location
    creator
    organizer
    attendees {
      email
      responseStatus
      name
    }
    summary
    level
  }
}
    `;

/**
 * __useGetEventByIdQuery__
 *
 * To run a query within a React component, call `useGetEventByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEventByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEventByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetEventByIdQuery(baseOptions: Apollo.QueryHookOptions<GetEventByIdQuery, GetEventByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEventByIdQuery, GetEventByIdQueryVariables>(GetEventByIdDocument, options);
      }
export function useGetEventByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEventByIdQuery, GetEventByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEventByIdQuery, GetEventByIdQueryVariables>(GetEventByIdDocument, options);
        }
export type GetEventByIdQueryHookResult = ReturnType<typeof useGetEventByIdQuery>;
export type GetEventByIdLazyQueryHookResult = ReturnType<typeof useGetEventByIdLazyQuery>;
export type GetEventByIdQueryResult = Apollo.QueryResult<GetEventByIdQuery, GetEventByIdQueryVariables>;
export const GetAllUserSchedulesDocument = gql`
    query GetAllUserSchedules($userId: String!) {
  getAllSchedules(userId: $userId) {
    id
    duration
    email
    objet
    sujet
    niveau
    localisation
    userInvited {
      email
      required
    }
    visioConf
    type
    status
    personNumber
    acceptedSlot
    reminder
    eventId
    debut
    fin
    creationDate
  }
}
    `;

/**
 * __useGetAllUserSchedulesQuery__
 *
 * To run a query within a React component, call `useGetAllUserSchedulesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllUserSchedulesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllUserSchedulesQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetAllUserSchedulesQuery(baseOptions: Apollo.QueryHookOptions<GetAllUserSchedulesQuery, GetAllUserSchedulesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllUserSchedulesQuery, GetAllUserSchedulesQueryVariables>(GetAllUserSchedulesDocument, options);
      }
export function useGetAllUserSchedulesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllUserSchedulesQuery, GetAllUserSchedulesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllUserSchedulesQuery, GetAllUserSchedulesQueryVariables>(GetAllUserSchedulesDocument, options);
        }
export type GetAllUserSchedulesQueryHookResult = ReturnType<typeof useGetAllUserSchedulesQuery>;
export type GetAllUserSchedulesLazyQueryHookResult = ReturnType<typeof useGetAllUserSchedulesLazyQuery>;
export type GetAllUserSchedulesQueryResult = Apollo.QueryResult<GetAllUserSchedulesQuery, GetAllUserSchedulesQueryVariables>;
export const GetScheduleByUserAndEventIdDocument = gql`
    query GetScheduleByUserAndEventId($userId: String!, $eventId: String!) {
  getScheduleByUserAndEventId(userId: $userId, eventId: $eventId) {
    id
    duration
    email
    objet
    sujet
    niveau
    localisation
    userInvited {
      email
      required
    }
    visioConf
    type
    status
    personNumber
    acceptedSlot
    reminder
    eventId
    debut
    fin
    creationDate
  }
}
    `;

/**
 * __useGetScheduleByUserAndEventIdQuery__
 *
 * To run a query within a React component, call `useGetScheduleByUserAndEventIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetScheduleByUserAndEventIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetScheduleByUserAndEventIdQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useGetScheduleByUserAndEventIdQuery(baseOptions: Apollo.QueryHookOptions<GetScheduleByUserAndEventIdQuery, GetScheduleByUserAndEventIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetScheduleByUserAndEventIdQuery, GetScheduleByUserAndEventIdQueryVariables>(GetScheduleByUserAndEventIdDocument, options);
      }
export function useGetScheduleByUserAndEventIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetScheduleByUserAndEventIdQuery, GetScheduleByUserAndEventIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetScheduleByUserAndEventIdQuery, GetScheduleByUserAndEventIdQueryVariables>(GetScheduleByUserAndEventIdDocument, options);
        }
export type GetScheduleByUserAndEventIdQueryHookResult = ReturnType<typeof useGetScheduleByUserAndEventIdQuery>;
export type GetScheduleByUserAndEventIdLazyQueryHookResult = ReturnType<typeof useGetScheduleByUserAndEventIdLazyQuery>;
export type GetScheduleByUserAndEventIdQueryResult = Apollo.QueryResult<GetScheduleByUserAndEventIdQuery, GetScheduleByUserAndEventIdQueryVariables>;
export const GetUserBookingLinkPreferencesDocument = gql`
    query GetUserBookingLinkPreferences($userId: String!) {
  getUserBookingPreferences(userId: $userId) {
    language
    duration
    level
    expirationDuration
    bookingTimes
  }
}
    `;

/**
 * __useGetUserBookingLinkPreferencesQuery__
 *
 * To run a query within a React component, call `useGetUserBookingLinkPreferencesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserBookingLinkPreferencesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserBookingLinkPreferencesQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserBookingLinkPreferencesQuery(baseOptions: Apollo.QueryHookOptions<GetUserBookingLinkPreferencesQuery, GetUserBookingLinkPreferencesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserBookingLinkPreferencesQuery, GetUserBookingLinkPreferencesQueryVariables>(GetUserBookingLinkPreferencesDocument, options);
      }
export function useGetUserBookingLinkPreferencesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserBookingLinkPreferencesQuery, GetUserBookingLinkPreferencesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserBookingLinkPreferencesQuery, GetUserBookingLinkPreferencesQueryVariables>(GetUserBookingLinkPreferencesDocument, options);
        }
export type GetUserBookingLinkPreferencesQueryHookResult = ReturnType<typeof useGetUserBookingLinkPreferencesQuery>;
export type GetUserBookingLinkPreferencesLazyQueryHookResult = ReturnType<typeof useGetUserBookingLinkPreferencesLazyQuery>;
export type GetUserBookingLinkPreferencesQueryResult = Apollo.QueryResult<GetUserBookingLinkPreferencesQuery, GetUserBookingLinkPreferencesQueryVariables>;
export const GetUserContactDocument = gql`
    query getUserContact($userId: String!) {
  getUserContacts(userId: $userId) {
    displayName
    emailAddresses
  }
}
    `;

/**
 * __useGetUserContactQuery__
 *
 * To run a query within a React component, call `useGetUserContactQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserContactQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserContactQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserContactQuery(baseOptions: Apollo.QueryHookOptions<GetUserContactQuery, GetUserContactQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserContactQuery, GetUserContactQueryVariables>(GetUserContactDocument, options);
      }
export function useGetUserContactLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserContactQuery, GetUserContactQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserContactQuery, GetUserContactQueryVariables>(GetUserContactDocument, options);
        }
export type GetUserContactQueryHookResult = ReturnType<typeof useGetUserContactQuery>;
export type GetUserContactLazyQueryHookResult = ReturnType<typeof useGetUserContactLazyQuery>;
export type GetUserContactQueryResult = Apollo.QueryResult<GetUserContactQuery, GetUserContactQueryVariables>;
export const GetAllUserTasksDocument = gql`
    query GetAllUserTasks($userId: String!) {
  getAllUserTasks(userId: $userId) {
    id
    duration
    tag
    status
    notes
    timezone
    startTime
    endTime
    deadline
    title
    mode
    assignedTo
    participants
    endDate
    priority
    startDate
    parentTaskId
    progress
    updatedAt
    createdAt
    userId
    scheduleId
    subtasks {
      id
      duration
      tag
      status
      notes
      timezone
      startTime
      endTime
      deadline
      title
      assignedTo
      participants
      endDate
      priority
      startDate
      parentTaskId
      progress
      updatedAt
      createdAt
      userId
      scheduleId
    }
  }
}
    `;

/**
 * __useGetAllUserTasksQuery__
 *
 * To run a query within a React component, call `useGetAllUserTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllUserTasksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllUserTasksQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetAllUserTasksQuery(baseOptions: Apollo.QueryHookOptions<GetAllUserTasksQuery, GetAllUserTasksQueryVariables> & ({ variables: GetAllUserTasksQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllUserTasksQuery, GetAllUserTasksQueryVariables>(GetAllUserTasksDocument, options);
      }
export function useGetAllUserTasksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllUserTasksQuery, GetAllUserTasksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllUserTasksQuery, GetAllUserTasksQueryVariables>(GetAllUserTasksDocument, options);
        }
export function useGetAllUserTasksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllUserTasksQuery, GetAllUserTasksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllUserTasksQuery, GetAllUserTasksQueryVariables>(GetAllUserTasksDocument, options);
        }
export type GetAllUserTasksQueryHookResult = ReturnType<typeof useGetAllUserTasksQuery>;
export type GetAllUserTasksLazyQueryHookResult = ReturnType<typeof useGetAllUserTasksLazyQuery>;
export type GetAllUserTasksSuspenseQueryHookResult = ReturnType<typeof useGetAllUserTasksSuspenseQuery>;
export type GetAllUserTasksQueryResult = Apollo.QueryResult<GetAllUserTasksQuery, GetAllUserTasksQueryVariables>;
export const GetTaskByIdDocument = gql`
    query GetTaskById($id: String!) {
  getTaskById(id: $id) {
    id
    duration
    tag
    status
    notes
    timezone
    startTime
    endTime
    deadline
    title
    assignedTo
    participants
    endDate
    priority
    startDate
    parentTaskId
    progress
    updatedAt
    createdAt
    userId
    scheduleId
  }
}
    `;

/**
 * __useGetTaskByIdQuery__
 *
 * To run a query within a React component, call `useGetTaskByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTaskByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTaskByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTaskByIdQuery(baseOptions: Apollo.QueryHookOptions<GetTaskByIdQuery, GetTaskByIdQueryVariables> & ({ variables: GetTaskByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTaskByIdQuery, GetTaskByIdQueryVariables>(GetTaskByIdDocument, options);
      }
export function useGetTaskByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTaskByIdQuery, GetTaskByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTaskByIdQuery, GetTaskByIdQueryVariables>(GetTaskByIdDocument, options);
        }
export function useGetTaskByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTaskByIdQuery, GetTaskByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTaskByIdQuery, GetTaskByIdQueryVariables>(GetTaskByIdDocument, options);
        }
export type GetTaskByIdQueryHookResult = ReturnType<typeof useGetTaskByIdQuery>;
export type GetTaskByIdLazyQueryHookResult = ReturnType<typeof useGetTaskByIdLazyQuery>;
export type GetTaskByIdSuspenseQueryHookResult = ReturnType<typeof useGetTaskByIdSuspenseQuery>;
export type GetTaskByIdQueryResult = Apollo.QueryResult<GetTaskByIdQuery, GetTaskByIdQueryVariables>;
export const NewIncomingEmailDocument = gql`
    subscription NewIncomingEmail($userId: String!) {
  newIncomingEmail(userId: $userId) {
    userId
    incomingEmails {
      id
      receivedDateTime
      object
      content
      isRead
      content
      cc
      recipients
      htmlBody
      sender {
        emailAddress
        name
      }
    }
  }
}
    `;

/**
 * __useNewIncomingEmailSubscription__
 *
 * To run a query within a React component, call `useNewIncomingEmailSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewIncomingEmailSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewIncomingEmailSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useNewIncomingEmailSubscription(baseOptions: Apollo.SubscriptionHookOptions<NewIncomingEmailSubscription, NewIncomingEmailSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewIncomingEmailSubscription, NewIncomingEmailSubscriptionVariables>(NewIncomingEmailDocument, options);
      }
export type NewIncomingEmailSubscriptionHookResult = ReturnType<typeof useNewIncomingEmailSubscription>;
export type NewIncomingEmailSubscriptionResult = Apollo.SubscriptionResult<NewIncomingEmailSubscription>;

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;


export type DeleteUserAccountMutationVariables = Exact<{
  userId: Scalars['String'];
}>;

export type DeleteUserAccountMutation = { __typename?: 'Mutation', deleteUserAccount: { __typename?: 'SuccessReturn', success: boolean } };

export const DeleteUserAccountDocument = gql`
  mutation DeleteUserAccount($userId: String!) {
    deleteUserAccount(userId: $userId) {
      success
      message
    }
  }
`;

export function useDeleteUserAccountMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserAccountMutation, DeleteUserAccountMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteUserAccountMutation, DeleteUserAccountMutationVariables>(DeleteUserAccountDocument, options);
}
    