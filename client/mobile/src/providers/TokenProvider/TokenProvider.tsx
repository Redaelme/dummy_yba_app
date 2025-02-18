import {ApolloProvider} from '@apollo/client';
import React, {useContext, useMemo} from 'react';
import {I18nextProvider} from 'react-i18next';
import {Navigation} from '../../components/Navigation';
import {createApolloClient} from '../../config/apollo';
import i18n from '../../services/i18n';
import {AuthContext} from '../AuthProvider/AuthProvider';
import {CalendarProvider} from '../Calendar/Calendar';
import {MeProvider} from '../me/meProvider';
import NetworkProvider from '../NetworkProvider';
import RealmRootProvider from '../RealmProvider';
import StatusBarValueProvider, {StatusBarContext,} from '../StatusBarValueProvider/StatusBarValueProvider';
import {TabBarVisibleProvider} from '../TabBarVisibleProvider';
import RealmNotificationProvider from "../RealmProvider/RealmNotificationProvider/RealmNotificationProvider";
import {NotificationProvider} from "../NotificationProvider/NotificationProvider";
import {IncomingAppointmentProvider} from "../IncomingAppointmentProvider";

const TokenProvider = () => {
  const { token } = useContext(AuthContext);
  // const client = createApolloClient(token || '');


  // Make sure the client is memoized so we don't recreate it every time
  const client = useMemo(() => {
    return createApolloClient(token || '');
  }, [token]);
  return (
      <NetworkProvider>
      <ApolloProvider client={client}>
          <MeProvider>
              <I18nextProvider i18n={i18n}>
                  <NotificationProvider>
                      <Navigation />
                  </NotificationProvider>
              </I18nextProvider>
          </MeProvider>
        </ApolloProvider>
        </NetworkProvider>

  );
};

export default TokenProvider;
