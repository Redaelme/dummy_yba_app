import { GoogleApis } from 'googleapis/build/src/googleapis';

export interface OutlookEvent {
  '@odata.context': string;
  value: OutlookEventValue[];
}

export interface OutlookEventValue {
  '@odata.etag': string;
  id: string;
  subject: string;
  bodyPreview: string;
  body: EmailBody;
  start: OutlookSchedulerTimezone;
  end: OutlookSchedulerTimezone;
  location: {
    displayName: string;
    locationType: string;
    uniqueIdType: string;
    address: any;
    coordinates: any;
  };
  attendees: {
    type: string;
    emailAddress: EmailUserInfo;
    status: {
      response: string;
      time: Date;
    };
  }[];
  organizer: EmailAddress;
  isCancelled: boolean;
}

export interface MSSingleEvent {
  '@odata.context': string;
  '@odata.etag': string;
  id: string;
  subject: string;
  bodyPreview: string;
  body: {
    contentType: string;
    content: string;
  };
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location: {
    displayName: string;
    locationType: string;
    uniqueId: string;
    uniqueIdType: string;
  };
  locations: [
    {
      displayName: string;
      locationType: string;
      uniqueIdType: string;
    },
    {
      displayName: string;
      locationType: string;
      uniqueId: string;
      uniqueIdType: string;
      address: {
        street: string;
        city: string;
        state: string;
        countryOrRegion: string;
        postalCode: string;
      };
      coordinates: {
        latitude: number;
        longitude: number;
      };
    },
    {
      displayName: string;
      locationType: string;
      uniqueIdType: string;
    },
  ];
  attendees: {
    type: string;
    status: {
      response: string;
      time: string;
    };
    emailAddress: {
      name: string;
      address: string;
    };
  }[];
  organizer: {
    emailAddress: {
      name: string;
      address: string;
    };
  };
  onlineMeeting?: {
    joinUrl: string;
  };
  reminderMinutesBeforeStart: number;
  webLink: string;
}

export interface EventAttendee {
  type: string;
  status: {
    response: string;
    time: string;
  };
  emailAddress: EmailUserInfo;
}

export interface EmailValue {
  '@odata.etag': string;
  id: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  changeKey: string;
  categories: any[];
  receivedDateTime: string;
  sentDateTime: string;
  hasAttachments: boolean;
  internetMessageId: string;
  subject: string;
  bodyPreview: string;
  importance: string;
  parentFolderId: string;
  conversationId: string;
  conversationIndex: string;
  isDeliveryReceiptRequested: any; // To verify
  isReadReceiptRequested: boolean;
  isRead: boolean;
  isDraft: boolean;
  webLink: string;
  inferenceClassification: string;
  body: EmailBody;
  sender: EmailAddress;
  from: EmailAddress;
  toRecipients: (EmailAddress | null)[]; // To verify
  ccRecipients: (EmailAddress | null)[]; // To verify
  bccRecipients: (EmailAddress | null)[]; // To verify
  replyTo: (EmailAddress | null)[]; // To verify
  flag: EmailFlag;
}

export interface EmailBody {
  contentType: string;
  content: string;
}

export interface EmailUserInfo {
  name: string;
  address: string;
}

export interface EmailAddress {
  emailAddress: EmailUserInfo;
}

export interface OutlookEmail {
  '@odata.context': string;
  value: EmailValue[];
}

export interface EmailFlag {
  flagStatus: string;
}

export interface ISendMEmail {
  from?: EmailAddress;
  subject: string;
  template: string;
  toRecipients?: EmailAddress[]; // To verify
  ccRecipients?: EmailAddress[]; // To verify
  bccRecipients?: EmailAddress[]; // To verify
  replyTo?: EmailAddress[]; // To verify
  params?: Object;
  body?: EmailBody;
  lang?: string;
}

export interface SubscriptionConfiguration {
  changeType: string;
  notificationUrl: string;
  resource: string;
  clientState: string;
  includeResourceData: boolean;
}

export interface SubscriptionData {
  '@odata.context': string;
  id: string;
  resource: string;
  applicationId: string;
  changeType: string;
  clientState: string;
  notificationUrl: string;
  notificationQueryOptions: Object | null;
  notificationContentType: any;
  lifecycleNotificationUrl: string | null;
  expirationDateTime: string;
  accessToken: string;
  creatorId: string;
  includeResourceData: boolean;
  latestSupportedTlsVersion: string;
  encryptionCertificate: any;
  encryptionCertificateId: any;
  userId: string;
}

export interface OutlookSchedulerTimezone {
  dateTime: string;
  timeZone?: string | null;
}

export interface ScheduleInformation {
  schedules: string[];
  startTime: OutlookSchedulerTimezone;
  endTime: OutlookSchedulerTimezone;
  availabilityViewInterval?: number;
}

export interface OutlookSchedule {
  '@odata.context': string;
  value: OutlookScheduleValue[];
}

export interface OutlookWorkingHours {
  daysOfWeek: string[];
  startTime: string | Date;
  endTime: string | Date;
  timeZone: {
    name: string;
  };
}

export interface OutlookScheduleValue {
  scheduleId: string;
  availabilityView: string;
  scheduleItems?: OutlookScheduleItem[];
  workingHours: OutlookWorkingHours;
}
export interface OutlookScheduleItem {
  isPrivate: boolean;
  status: string;
  subject: string;
  location: string;
  start: OutlookSchedulerTimezone;
  end: OutlookSchedulerTimezone;
}

export interface SlotProps {
  start: Date;
  end: Date;
  duration: number;
}
export type OAuth2Client = typeof GoogleApis.prototype.auth.OAuth2.prototype;

export interface MSGroupGroups {
  '@odata.context': string;
  // eslint-disable-next-line no-use-before-define
  value: MSGroupValue[];
}

export interface MSGroupValue {
  id: string;
  deletedDateTime: Date | string | null;
  classification: Date | string | null;
  createdDateTime: Date | string;
  creationOptions: string[];
  description: string;
  displayName: string;
  expirationDateTime: Date | string | null;
  groupTypes: string[];
  isAssignableToRole: any;
  mail: string;
  mailEnabled: boolean;
  mailNickname: string;
  membershipRule: any;
  membershipRuleProcessingState: any;
  onPremisesDomainName: any;
  onPremisesLastSyncDateTime: any;
  onPremisesNetBiosName: any;
  onPremisesSamAccountName: any;
  onPremisesSecurityIdentifier: any;
  onPremisesSyncEnabled: any;
  preferredDataLocation: any;
  preferredLanguage: any;
  proxyAddresses: string[];
  renewedDateTime: Date | string | null;
  resourceBehaviorOptions: any[];
  resourceProvisioningOptions: any[];
  securityEnabled: boolean;
  securityIdentifier: string;
  theme: any;
  visibility: string;
  onPremisesProvisioningErrors: any[];
}

export interface MSCalendar {
  '@odata.context': string;
  value: MSCalendarValue[];
}

export interface MSCalendarValue {
  id: string;
  name: string;
  color: string;
  changeKey: string;
  canShare: boolean;
  canViewPrivateItems: boolean;
  defaultOnlineMeetingProvider: string | null;
  canEdit: boolean;
  owner: {
    name: string;
    address: string;
  };
  isDefaultCalendar: boolean;
}

export interface MSEventInput {
  subject: string;
  body: {
    contentType: string;
    content: string;
  };
  start: OutlookSchedulerTimezone;
  end: OutlookSchedulerTimezone;
  location: {
    displayName: string;
    locationType: string;
    locationEmailAddress: string;
    address: {
      street: string;
      city: string;
      state: string;
      countryOrRegion: string;
      postalCode: string;
    } | null;
  };
  attendees: {
    emailAddress: EmailUserInfo;
    type?: string;
  }[];
  allowNewTimeProposals: boolean;
  isOnlineMeeting?: boolean;
  isReminderOn: boolean;
  reminderMinutesBeforeStart: number;
}

export interface MSContact {
  '@odata.context': string;
  value: MSContactValue[];
}

export interface MSContactHomeAddress {
  street: string;
  city: string;
  state: string;
  countryOrRegion: string;
  postalCode: string;
}

export interface MSContactValue {
  '@odata.etag': string;
  id: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  changeKey: string;
  categories: any[];
  parentFolderId: string;
  birthday: any;
  fileAs: string;
  displayName: string;
  givenName: string;
  initials: any;
  middleName: string;
  nickName: string;
  surname: string;
  title: string;
  yomiGivenName: string;
  yomiSurname: string;
  yomiCompanyName: string;
  generation: any;
  imAddresses: string[];
  jobTitle: string;
  companyName: string;
  department: string;
  officeLocation: any;
  profession: any;
  businessHomePage: any;
  assistantName: string;
  manager: any;
  homePhones: any[];
  mobilePhone: any;
  businessPhones: any[];
  spouseName: any;
  personalNotes: string | null;
  children: any[];
  emailAddresses: EmailUserInfo[];
  homeAddress: any;
  businessAddress: MSContactHomeAddress;
  otherAddress: any;
}

export interface GoogleContacts {
  id: {
    $t: string;
  };
  updated: { $t: string | Date };
  category: [
    {
      scheme: string;
      term: string;
    },
  ];
  title: { $t: string; type: string };
  link: [
    {
      rel: string;
      type: string;
      href: string;
    },
    {
      rel: string;
      type: string;
      href: string;
    },
    {
      rel: string;
      type: string;
      href: string;
    },
  ];
  gd$email: [{ address: string; primary: string; rel: string }];
}

export interface ParsedSavedSlotsProps {
  saved: {
    start: string | Date;
    end: string | Date;
  }[];
  response?: {
    email: string;
    slots: {
      start: string | Date;
      end: string | Date;
    }[];
  }[];
  recipients: (
    | {
        email: string;
        responded: boolean;
        required: boolean;
      }
    | undefined
  )[];
  iterationNumber: number;
  location?: string;
}

export interface MatchingEvent {
  id: string;
  summary: string;
  start: Date;
  end: Date;
  location: string;
  attendees: string[];
  organizer: string;
  description: string;
}
export interface OnlineMeetingInputs {
  startDateTime: string; //DateTime
  endDateTime: string; //DateTime
  subject: string;
}

export interface OnlineMeetingResponse {
  '@odata.type': string;
  '@odata.context': string;
  audioConferencing: {
    tollNumber: string;
    tollFreeNumber: string;
    ConferenceId: string;
    dialinUrl: string;
  };
  chatInfo: {
    threadId: string;
    messageId: string;
    replyChainMessageId: string;
  };
  creationDateTime: Date;
  startDateTime: Date;
  endDateTime: Date;
  id: string;
  joinWebUrl: string;
  participants: {
    organizer: {
      identity: {
        user: {
          id: string;
          displayName: string;
        };
      };
      upn: string;
    };
  };
  subject: string;
}
