import moment from 'moment';
import React, { createContext, FC, useContext, useEffect } from 'react';
import base64 from 'react-native-base64';
import utf8 from 'utf8';
import {
  useGetMailUserMutation,
  useNewIncomingEmailSubscription,
  useUpdateIncomingRequestReceveidDateTimeMutationMutation,
} from '../../../generated/graphql';
import { USER_SCHEMA } from '../../../models/User';
import MLModule from '../../../services/MLModule';
import { MeContext } from '../../me/meProvider';
import { RealmMe } from '../interfaces';
import { RealmContext } from '../RealmProvider';

interface RealmMeContextType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  setMailToClassify: (maxResult?: number) => void;
}

interface RealmMeProviderProps {}

export const RealmMeContext = createContext<RealmMeContextType>({
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  setMailToClassify: () => {},
});

const RealmMeProvider: FC<RealmMeProviderProps> = (props) => {
  const { realm } = useContext(RealmContext);
  const { me } = useContext(MeContext);
  const { loadModel, classify } = MLModule;
  const [getMailUser, { data, loading, error: mutationError }] = useGetMailUserMutation({
    ignoreResults: true,
  });
  const [updateIncomingRequestFilter] = useUpdateIncomingRequestReceveidDateTimeMutationMutation();

  let id: string = '';
  let firstName: string = '';
  let lastName: string = '';
  let email: string = '';

  useEffect(() => {
    if (me && realm) {
      const resultOfCheckId = realm.objects<RealmMe>(USER_SCHEMA).find((item) => item.id === me.id);
      if (!resultOfCheckId) {
        realm.write(() => {
          realm.create<RealmMe>(
            USER_SCHEMA,
            { id: me.id, firstName: me.prenom, lastName: me.nom, email: me.mail },
            Realm.UpdateMode.All,
          );
        });
      } else {
        const res = realm.objectForPrimaryKey<RealmMe>(USER_SCHEMA, me.id);
        if (res) {
          id = res.id;
          firstName = res.firstName;
          lastName = res.lastName;
          email = res.email;
        }
      }
    }
  });

  const setMailToClassify = (maxResult?: number) => {

    return;
  };

  const { loading: incomingEmailLoading, error } = useNewIncomingEmailSubscription({
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (
        subscriptionData &&
        subscriptionData.data &&
        subscriptionData.data.newIncomingEmail &&
        subscriptionData.data.newIncomingEmail.incomingEmails &&
        subscriptionData.data.newIncomingEmail.incomingEmails.length
      ) {
        const { incomingEmails } = subscriptionData.data.newIncomingEmail;
        for (const email of incomingEmails) {
          if (email) {
            const utf8Bytes = base64.decode(email.content);
            const content = utf8.decode(utf8Bytes);

            const htmlBodyUtf8Bytes = base64.decode(email.htmlBody || '');
            const htmlBody = utf8.decode(htmlBodyUtf8Bytes);
            // const contentToClassify = `${email.object} ${content}`;
            const emailToClassify = { ...email, content, htmlBody };
            loadModel('model6.tflite');

            classify(JSON.stringify(emailToClassify));
          }
        }
      }
    },
    variables: {
      userId: me ? me.id : '',
    },
  });

  return (
    <RealmMeContext.Provider value={{ id, firstName, lastName, email, setMailToClassify }}>
      {props.children}
    </RealmMeContext.Provider>
  );
};

export default RealmMeProvider;
