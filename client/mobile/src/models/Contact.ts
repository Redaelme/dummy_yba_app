import Realm from 'realm';

export const CONTACT_SCHEMA = 'Contact';

const ContactSchema: Realm.ObjectSchema = {
  name: CONTACT_SCHEMA,
  primaryKey: 'fullName',
  properties: {
    fullName: 'string',
    email: 'string',
    recordID: 'string',
    phoneNumber: 'string',
    otherInfo: 'string',
  },
};

export default ContactSchema;
