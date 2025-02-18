import React, { FC, createContext, useContext } from 'react';
import { CONTACT_SCHEMA } from '../../../models/Contact';
import { RealmContact } from '../interfaces';
import { RealmContext } from '../RealmProvider';

interface RealmContactContextType {
  createRealmContact: (contacts: RealmContact[]) => void;
  refetchRealmContactList: (contacts: RealmContact[]) => void;
  getRealmContacts: () => RealmContact[];
}

export const RealmContactContext = createContext<RealmContactContextType>({
  createRealmContact: () => {},
  refetchRealmContactList: () => {},
  getRealmContacts: () => [],
});

interface RealmContactProviderProps {}

const RealmContactProvider: FC<RealmContactProviderProps> = (props) => {
  const { realm } = useContext(RealmContext);

  const createRealmContact = (contacts: RealmContact[]) => {
    if (realm) {
      realm.write(() => {
        contacts.map((item: RealmContact) => {
          realm.create<RealmContact>(CONTACT_SCHEMA, item, Realm.UpdateMode.All);
        });
      });
    }
  };

  const refetchRealmContactList = (contacts: RealmContact[]) => {
    if (realm) {
      realm.write(() => {
        realm.deleteModel(CONTACT_SCHEMA);
      });
      realm.write(() => {
        contacts.map((item: RealmContact) => {
          realm.create<RealmContact>(CONTACT_SCHEMA, item, Realm.UpdateMode.All);
        });
      });
    }
  };

  const getRealmContacts = (): RealmContact[] => {
    if (realm) {
      const res = realm.objects<RealmContact>(CONTACT_SCHEMA).map((item) => item as RealmContact);
      return res;
    }
    return [];
  };

  return (
    <RealmContactContext.Provider
      value={{ createRealmContact, refetchRealmContactList, getRealmContacts }}
    >
      {props.children}
    </RealmContactContext.Provider>
  );
};

export default RealmContactProvider;
