import Realm from 'realm';

export const NOTIFICATION_SCHEMA = 'Notification';

const NotificationSchema: Realm.ObjectSchema = {
  name: NOTIFICATION_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'string',
    data: 'string',
  },
};

export default NotificationSchema;
