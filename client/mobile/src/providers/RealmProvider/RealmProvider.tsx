import React, { FC, createContext, useState, useEffect } from 'react';
import Realm from 'realm';
import RealmSchema from './schema';

export interface RealmContextType {
  realm: Realm | null;
}

export const RealmContext = createContext<RealmContextType>({
  realm: null,
});

interface RealmProviderProps {}

const RealmProvider: FC<RealmProviderProps> = (props) => {
  const [realm, setRealm] = useState<Realm | null>(null);

  useEffect(() => {
    Realm.open({ schema: RealmSchema, schemaVersion: 1 })
      .then((realm: Realm) => {
        console.log('Connected successfully to RealmDB');
        setRealm(realm);
      })
      .catch((error: any) => {
        console.log('Realm connection error:', error);
      });
  }, []);

  return <RealmContext.Provider value={{ realm }}>{props.children}</RealmContext.Provider>;
};

export default RealmProvider;
