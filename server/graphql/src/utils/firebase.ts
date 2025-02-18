import firebase from 'firebase-admin';
import { prisma } from '../configs/context';

export const sendNotificationPush = async (
    title: string,
    body: string,
    email: string,
    data?: any,
) => {
  const userAuth = await prisma.user.findFirst({ where: { email } });

  if (!userAuth) {
    throw new Error('User must be logged in');
  }

  console.log(`Payload in push notification ${JSON.stringify(data)}`);

  const tokenList = await prisma.notification.findMany({ where: { userId: userAuth.id } });

  if (tokenList.length === 0) {
    console.log('No tokens found for user');
    return;
  }

  console.log("sending msg to tokens", tokenList);

  const messages = tokenList.map(token => ({
    notification: {
      title,
      body,
    },
    data: data ? { ...data } : undefined,
    token: token.token,
    tokenId: token.id,
  }));

  for (const message of messages) {
    try {
      const response = await firebase.messaging().send({
        notification: message.notification,
        data: message.data,
        token: message.token,
      });
      console.log('Successfully sent push notification:', response);
    } catch (error) {
      console.log('Error sending message:', error);

      if (error.code === 'messaging/registration-token-not-registered') {
        console.error('FCM registration token is not registered. Removing token from database.');
        try {
          await prisma.notification.delete({
            where: {
              id: message.tokenId,
            },
          });
          console.log('Token removed from database');
        } catch (err) {
          console.error('Error removing token from database:', err);
        }
      }
    }
  }
};