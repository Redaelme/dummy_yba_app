import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApolloClient } from '../config/apollo';
import { GET_USER_MAIL } from '../gql/User/mutation';
import base64 from 'react-native-base64';
import utf8 from 'utf8';
import MLModule from './MLModule';
import {useContext} from "react";
import {IncomingAppointmentContext} from "../providers/IncomingAppointmentProvider/IncomingAppointmentProvider";

export const backgroundNotificationHandler = async (maxResult: number | undefined) => {

  try {
    const { loadModel, classify } = MLModule;
    const access_token = await AsyncStorage.getItem('token');

    console.log('backgroundNotificationHandler');
    // setRefetch(true);
    if (false) {
      const client = createApolloClient(access_token || '');
      console.log({ client });
      const { data } = await client.mutate({
        mutation: GET_USER_MAIL,
        variables: {
          data: { maxResult: maxResult ? maxResult : 500 },
        },
      });

      if (data?.getUserMail && data?.getUserMail?.length && data?.getUserMail?.[0]) {
        const lastMail = data.getUserMail;

        for (const mailItem of lastMail) {
          if (mailItem) {
            const {
              __typename,
              cc,
              content: ct,
              htmlBody: hb,
              id,
              isRead,
              object,
              receivedDateTime,
              recipients,
              sender,
              subject,
            } = mailItem;
            const email = {
              cc: cc as string[],
              content: ct || '',
              htmlBody: hb || '',
              id: id || '',
              isRead: isRead || false,
              object: object || '',
              receivedDateTime,
              recipients: recipients as string[],
              sender: sender as { emailAddress: string; name: string },
              subject: subject || '',
            };

            const utf8Bytes = base64.decode(email.content);
            const content = utf8.decode(utf8Bytes);
            const htmlBodyUtf8Bytes = base64.decode(email.htmlBody || '');
            const htmlBody = utf8.decode(htmlBodyUtf8Bytes);

            // const emailToClassify = { ...email, content, htmlBody };
            // loadModel('model6.tflite');
            console.log(' -------classify:');
            // classify(JSON.stringify(emailToClassify));
          }
        }
      }
    }
  } catch (error) {
    console.log('An error has occurred', error);
  }
};
