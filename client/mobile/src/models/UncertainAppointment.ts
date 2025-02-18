import Realm from 'realm';

export const UNCERTAIN_APPOINTMENT_SCHEMA = 'UncertainAppointment';

const UncertainAppointmentSchema: Realm.ObjectSchema = {
  name: UNCERTAIN_APPOINTMENT_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'string',
    objectContents: 'string',
    userId: 'string',
  },
};

export default UncertainAppointmentSchema;
