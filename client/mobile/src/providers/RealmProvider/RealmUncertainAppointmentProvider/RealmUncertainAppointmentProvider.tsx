import React, { createContext, FC, useContext } from 'react';
import { UNCERTAIN_APPOINTMENT_SCHEMA } from '../../../models/UncertainAppointment';
import { RealmContext } from '../RealmProvider';

export const SUCCESS = 'succesfully add an uncertain appointment';

export interface UncertainAppointment {
  id: string;
  objectContents: string;
  userId: string;
}

export interface UncertainAppointmentContextType {
  addRealmUncertainAppointment: (uncertainAppointement: UncertainAppointment) => string;
  getRealmUncertainAppointment: (id: string) => UncertainAppointment[];
  deleteRealmUncertainAppointment: (id: string) => boolean;
}

export const RealmUncertainAppointmentContext = createContext<UncertainAppointmentContextType>({
  addRealmUncertainAppointment: () => '',
  getRealmUncertainAppointment: () => [],
  deleteRealmUncertainAppointment: () => false,
});

interface UncertainAppointmentProviderProps {}

const RealmUncertainAppointmentProvider: FC<UncertainAppointmentProviderProps> = (props) => {
  const { realm } = useContext(RealmContext);

  const addRealmUncertainAppointment = (uncertainAppointement: UncertainAppointment) => {
    if (realm) {
      const checkElementToAdd = getRealmUncertainAppointment(uncertainAppointement.id);
      if (checkElementToAdd.length === 0) {
        realm.write(() => {
          realm.create<UncertainAppointment>(
            UNCERTAIN_APPOINTMENT_SCHEMA,
            uncertainAppointement,
            Realm.UpdateMode.All,
          );
        });
        return SUCCESS;
      }
    }
    return '';
  };

  const getRealmUncertainAppointment = (id: string) => {
    if (realm) {
      const res = realm
        .objects<UncertainAppointment>(UNCERTAIN_APPOINTMENT_SCHEMA)
        .map((item) => item as UncertainAppointment)
        .filter((element) => element.userId === id);
      return res;
    }
    return [];
  };

  const deleteRealmUncertainAppointment = (id: string) => {
    if (realm) {
      const objectToDeleted = realm
        .objects<UncertainAppointment>(UNCERTAIN_APPOINTMENT_SCHEMA)
        .map((item) => item as UncertainAppointment)
        .find((element) => element.id === id);
      if (objectToDeleted) {
        try {
          realm.beginTransaction();
          realm.delete(objectToDeleted);
          realm.commitTransaction();
          return true;
        } catch {
          realm.cancelTransaction();
        }
      } else {
        return false;
      }
    }
    return false;
  };

  return (
    <RealmUncertainAppointmentContext.Provider
      value={{
        addRealmUncertainAppointment,
        getRealmUncertainAppointment,
        deleteRealmUncertainAppointment,
      }}
    >
      {props.children}
    </RealmUncertainAppointmentContext.Provider>
  );
};

export default RealmUncertainAppointmentProvider;
