import React, { FC } from 'react';
import RealmProvider from './RealmProvider';
import { RealmContactProvider } from './RealmContactProvider';
import RealmMeProvider from './RealmMeProvider/RealmMeProvider';
import RealmNotificationProvider from './RealmNotificationProvider/RealmNotificationProvider';
import { RealmUncertainAppointmentProvider } from './RealmUncertainAppointmentProvider';

interface RealmRootProviderProps {}

const RealmRootProvider: FC<RealmRootProviderProps> = (props) => {
  return (
    <RealmProvider>
      <RealmMeProvider>
        <RealmContactProvider>
          <RealmNotificationProvider>
                {props.children}
          </RealmNotificationProvider>
        </RealmContactProvider>
      </RealmMeProvider>
    </RealmProvider>
  );
};

export default RealmRootProvider;
