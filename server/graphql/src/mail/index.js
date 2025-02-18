/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
const subscriptionName = process.env.PUBSUB;
const timeout = 60;

// Imports the Google Cloud client library

const { PubSub } = require('@google-cloud/pubsub');
const fs = require('fs');
const http = require('http');
const readline = require('readline');
const { google } = require('googleapis');

console.log('env=', process.env.GOOGLE_APPLICATION_CREDENTIALS);
// If modifying these scopes, delete token.json.
const SCOPES = [
  // 'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/pubsub',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/contacts.readonly',
];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Gmail API.
  authorize(JSON.parse(content), (auth) => {
    // eslint-disable-next-line no-unused-expressions
    watchMyLabel(auth);
  });
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, async (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    console.log('token=', JSON.parse(token));
    oAuth2Client.setCredentials(JSON.parse(token));
   // console.log('newToken=', await oAuth2Client.getAccessToken());
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}
/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listUnreadMsgs(auth, startHistoryId) {
  const gmail = google.gmail({
    auth,
    version: 'v1',
  });

  gmail.users.history.list(
    {
      userId: 'me',
      startHistoryId,
    },
    async function (err, results) {
      // https://developers.google.com/gmail/api/v1/reference/users/history/list#response
      if (err) return console.log(err);
      const latest = await results.data.history[results.data.history.length - 1].messages;
      gmail.users.messages.get(
        {
          userId: 'me',
          id: latest[latest.length - 1].id,
        },
        (err, res) => {
          if (res.data.labelIds.includes('UNREAD')) {
            console.log(res.data.snippet);
          } else {
            console.log('No unread messages here!');
          }
        },
      );
    },
  );
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function watchMyLabel(auth) {
  const gmail = google.gmail({
    version: 'v1',
    auth,
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
      console.log('res== mail/index', res.statusText);
      listenForMessages(auth);
    })
    .catch((error) => {
      console.log('errror', error);
    });
}

async function listenForMessages(auth) {
  const pubSubClient = new PubSub();
  //const pubSubClient = new PubSub({ clientOptions: { additionalClaims: } });
  console.log('Listen mail/inbox....');
  // References an existing subscription
  const subscription = pubSubClient.subscription(subscriptionName);

  // Create an event handler to handle messages
  let messageCount = 0;

  const messageHandler = async (message) => {
    console.log(`Received message ${message.id}:`);
    // console.log(`\tData: ${message.data}`);
    // console.log(`\tAttributes: ${JSON.stringify(message.attributes)}`);

    messageCount += 1;
    //await getMessage(auth, message.data);
    // "Ack" (acknowledge receipt of) the message
    message.ack();
  };

  // Listen for new messages until timeout is hit
   subscription.on('message', messageHandler);
  // subscription.on('message', (message) => {
  //   console.log('Received message:', message.data.toString());
  //   process.exit(0);
  // });

  // setTimeout(() => {
  //   subscription.removeListener('message', messageHandler);
  //   console.log(`${messageCount} message(s) received.`);
  // }, timeout * 10000);
}
function getMessage(auth, startHistoryId) {
  const gmail = google.gmail({ version: 'v1', auth });
  const { historyId, emailAdress } = JSON.parse(startHistoryId);
  // console.log('Get message==>', historyId);
  // eslint-disable-next-line no-shadow
  return new Promise((resolve, reject) => {
    gmail.users.history.list(
      {
        userId: 'me',
        startHistoryId: historyId,
      },
      async (err, results) => {
        try {
          if (err || !results.data.history) return console.log('...');
          const latest = await results.data.history[results.data.history.length - 1].messages;
          console.log('latest==>', latest);

          fs.readFile('id.json', (err, content) => {
            if (err) {
              fs.writeFile('id.json', JSON.stringify(latest[latest.length - 1].id), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', 'id.json');
              });
            }
            console.log(
              latest[latest.length - 1].id,
              '=== ',
              JSON.parse(content),
              '?',
              latest[latest.length - 1].id === content,
            );
            if (latest[latest.length - 1].id === JSON.parse(content)) {
              console.log('le meme');
            } else {
              console.log('different');
              fs.writeFile('id.json', JSON.stringify(latest[latest.length - 1].id), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', 'id.json');
              });
              gmail.users.messages.get(
                {
                  userId: 'me',
                  id: latest[latest.length - 1].id,
                },
                (err, res) => {
                  if (err) {
                    console.log('-----');
                  }
                  // console.log(res.data);
                  if (res && res.data) {
                    console.log(
                      '****************************************************************************************************************************************',
                    );
                    console.log(JSON.stringify(res.data.snippet));
                    console.log(
                      '****************************************************************************************************************************************',
                    );
                    // console.log(JSON.stringify(res));
                  }
                },
              );
            }
          });
        } catch (error) {
          console.log('error catched');
        }
      },
    );
  });
}
