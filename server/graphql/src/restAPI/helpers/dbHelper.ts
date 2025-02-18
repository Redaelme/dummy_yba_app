import { PrismaClient } from '@prisma/client';
import { SubscriptionData } from '../../types/types';

const prisma = new PrismaClient();

export async function getSubscription(subscriptionId: string) {

  const subscription = await prisma.emailSubscription.findUnique({
    where: { SubscriptionId: subscriptionId },
  });

  return subscription;
}
export const saveSubscription = async (subscriptionData: SubscriptionData) => {
  // Will handle save subscription

  const {
    id,
    accessToken,
    resource,
    clientState,
    changeType,
    notificationUrl,
    expirationDateTime,
    userId,
  } = subscriptionData;
  console.log('saving subscription');
  const existingSubscription = await prisma.emailSubscription.findFirst({where: { userId },});

  if (existingSubscription) {
    const updatedSubscription = await prisma.emailSubscription.update({
      where: { id: existingSubscription.id },
      data: {
        AccessToken: accessToken,
        Resource: resource,
        ClientState: clientState,
        ChangeType: changeType,
        NotificationUrl: notificationUrl,
        SubscriptionExpirationDateTime: expirationDateTime,
        userId,
      },
    });
    console.log('Subscription updated:', updatedSubscription);
    return updatedSubscription;
  } else {
    const newSubscription = await prisma.emailSubscription.create({
      data: {
        SubscriptionId: id,
        AccessToken: accessToken,
        Resource: resource,
        ClientState: clientState,
        ChangeType: changeType,
        NotificationUrl: notificationUrl,
        SubscriptionExpirationDateTime: expirationDateTime,
        userId,
      },
    });
    console.log('Subscription created:', newSubscription);
    return newSubscription;
  }
};
