/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
const subscriptionName = 'projects/yesboss-316810/topics/yessboss_topics';
const timeout = 60;

// Imports the Google Cloud client library

const { PubSub } = require('@google-cloud/pubsub');
const credentials = require('./services-accounts.json');

// Creates a client; cache this for further use
const {
  auth_provider_x509_cert_url,
  auth_uri,
  client_email,
  client_id,
  client_x509_cert_url,
  private_key,
  private_key_id,
  project_id,
  token_uri,
  type,
} = credentials;
const pubSubClient = new PubSub();

function listenForMessages() {
  console.log('Listen....');
  // References an existing subscription
  const subscription = pubSubClient.subscription(subscriptionName);

  // Create an event handler to handle messages
  let messageCount = 0;
  const messageHandler = message => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);
    messageCount += 1;

    // "Ack" (acknowledge receipt of) the message
    message.ack();
  };

  // Listen for new messages until timeout is hit
  subscription.on('message', messageHandler);

  setTimeout(() => {
    subscription.removeListener('message', messageHandler);
    console.log(`${messageCount} message(s) received.`);
  }, timeout * 1000);
}

listenForMessages();
