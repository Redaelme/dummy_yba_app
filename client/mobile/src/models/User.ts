import Realm from 'realm';

export const USER_SCHEMA = 'User';

const UserSchema: Realm.ObjectSchema = {
  name: USER_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'string',
    firstName: 'string',
    lastName: 'string',
    email: 'string',
  },
};

export default UserSchema;
