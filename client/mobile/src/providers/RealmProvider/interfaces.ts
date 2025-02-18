import Real from 'realm';

export interface RealmContextType {
  realm: Realm | null;
  syncIds: number[];
  pushSyncId: (id: number) => void;
  emptySyncIds: () => void;
  removeSyncId: (id: number) => void;
}

export interface RealmContact {
  fullName: string;
  email: string;
  phoneNumber: string;
  recordID: string;
  otherInfo?: String;
}

export interface RealmMe {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface RealmNotification {
  id: string;
  data: string;
}
export interface IMessage {
  sender: {
    emailAddress: string;
    name: string;
  };
  recipients: (string | undefined)[];
  cc: (string | undefined)[];
  object: string;
  content: string;
  id: string;
  isRead: boolean;
  receivedDateTime: string;
  subject: string;
  htmlBody: string;
}
