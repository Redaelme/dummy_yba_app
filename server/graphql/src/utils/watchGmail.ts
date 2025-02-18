import { PubSub } from '@google-cloud/pubsub';
import { google } from 'googleapis';
import { Context } from '../types/contextType';

const fs = require('fs');

export const watchMyLabel = async (ctx: Context) => {
  const TOKEN_PATH = 'token.json';
  const { oAuth2Client } = ctx;
  fs.readFile(TOKEN_PATH, async (err: any, token: any) => {
    if (err) return console.log('error:', err);

    console.log('token=', JSON.parse(token));
    oAuth2Client.setCredentials(JSON.parse(token));
    const gmail = google.gmail({
      version: 'v1',
      auth: oAuth2Client,
    });
    await gmail.users
      .watch({
        userId: 'me',
        requestBody: {
          labelIds: ['UNREAD'],
          labelFilterAction: 'include',
          topicName: 'projects/yesboss-316810/topics/yessboss_topics',
        },
      })
      .then((res) => {
        console.log('res==', res.statusText);
        listenForMessages(oAuth2Client);
      })
      .catch((error) => {
        console.log('errror', error);
      });
  });
};

const listenForMessages = async (auth: any) => {
  const pubSubClient = new PubSub();
  console.log('Listen watch gmail....');

  // References an existing subscription
  const subscription = pubSubClient.subscription(process.env.PUBSUB);

  // Create an event handler to handle messages
  const messageCount = 0;
  const messageHandler = async (message: { data: any; ack: () => void }) => {
    console.log(`Received message ${message.data}:`);

    //   messageCount += 1;
    // await getMessage(auth, message.data);
    // "Ack" (acknowledge receipt of) the message
    message.ack();
  };

  // Listen for new messages until timeout is hit
  subscription.on('message', messageHandler);

  setTimeout(() => {
    subscription.removeListener('message', messageHandler);
    console.log(`${messageCount} message(s) received.`);
  }, 600 * 1000);
};
