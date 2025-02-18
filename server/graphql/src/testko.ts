// import { google } from 'googleapis';
// import path from 'node:path';
// import * as handleBars from 'handlebars';

// import { buildEmail, getGoogleToken, sendCommonNewMessage } from './utils/commonBusinessLogic';
// const fs = require('fs');

// const TOKEN_PATH = 'token.json';

// const content = buildEmail(
//   'Proposition de créneaux',
//   // ['jacob@hairun-technology.com', 'michel@hairun-technology.com'],
//   ['jacob@hairun-technology.com'],
//   'slotProposal',
//   {
//     subject: 'Brainstorming et Budget pour la Campagne Marketing Printemps 2021',
//     location: '8 rua Lucce 33100 Milano.',
//     calendar: 'Color Trends, Localisation, Models, Budget',
//     slots: ['19 Avril 14:00', '19 Avril 16:00', '19 Avril 18:00'],
//     choseSlotUrl: '<End-point to use>',
//     askOtherSlots: '<Other endpoint to use>',
//   },
// );

// function makeBody(to: any, from: any, subject: any, message: any) {
//   var str = [
//     'Content-Type: text/html; \n',
//     'MIME-Version: 1.0\n',
//     'Content-Transfer-Encoding: 7bit\n',
//     'to: ',
//     to,
//     '\n',
//     'from: ',
//     from,
//     '\n',
//     'subject: ',
//     subject,
//     '\n\n',
//     message,
//   ].join('');
//   //@ts-ignore
//   var encodedMail = new Buffer.from(str, 'ascii')
//     .toString('base64')
//     .replace(/\+/g, '-')
//     .replace(/\//g, '_');
//   return encodedMail;
// }

// export const sendGmailMail = (mail: any) => (auth: any) => {
//   //Request (token)
//   // console.log(mail);

//   //Authorization code
//   // console.log('222222222222');
//   var template = handleBars.compile(mail.data.html);

//   const recipients: string[] = [];
//   content.toRecipients?.map((item) => {
//     return recipients.push(item.emailAddress.address.toString());
//   });
//   var raw = makeBody(
//     recipients,
//     content.from,
//     content.subject.toString(),
//     template({}),
//     // '<h1>test message</h1>',
//   );

//   return new Promise((resolve, reject) => {
//     const gmail = google.gmail({ version: 'v1', auth });

//     gmail.users.messages.send(
//       {
//         userId: 'me',
//         // @ts-ignore
//         resource: {
//           raw,
//         },
//       },
//       (err: any, res: { data: unknown }) => {
//         if (err) {
//           reject(err);
//           return;
//         }
//         if (!res?.data) {
//           resolve([]);
//           return;
//         }
//         resolve(res.data);
//       },
//     );
//   });
//   //Exchange code for token
//   //Token response
//   // Use token to call Google API
// };

// // fs.readFile(path.join(__dirname, 'credentials.json'), (err: any, content: any) => {
// //   if (err) return console.log('Error loading client secret file:', err);
// //   // Authorize a client with credentials, then call the Gmail API.
// //   authorize(JSON.parse(content), sendGmailMail);
// // });

// function authorize(credentials: any, callback: any) {
//   const { client_secret, client_id, redirect_uris } = credentials.installed;
//   const oAuth2Client = new google.auth.OAuth2({
//     clientId: client_id,
//     clientSecret: client_secret,
//     redirectUri: redirect_uris[0],
//   });
//   // 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjE5ZmUyYTdiNjc5NTIzOTYwNmNhMGE3NTA3OTRhN2JkOWZkOTU5NjEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0NTEwOTcxODg5MzQtOHZ1b21pbWZxNjYxNGVtMzlqdGpjbzlzMHBlZWxuZTMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0NTEwOTcxODg5MzQtZDU4ZGZxYmpsMmQ5bTU5NGcyZm1zN2Z2YXYxcWZldWouYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDEwMDkyMjU2Nzc0NzQyODI3NzciLCJlbWFpbCI6InNhZmlkeWhhcmluYWxhMTAxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiU2FmaWR5IEhhcmluYWxhIFJBTEFWQU5EUk9USUFWQU5BIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdpTHNnUW1mYjluMDFjMGl2dXExRGI5TkxsQ1pBYkRoN2wzMm9jekJBPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlNhZmlkeSBIYXJpbmFsYSIsImZhbWlseV9uYW1lIjoiUkFMQVZBTkRST1RJQVZBTkEiLCJsb2NhbGUiOiJmciIsImlhdCI6MTYyNDI4NjQwMywiZXhwIjoxNjI0MjkwMDAzfQ.iMdmudmVsXRVd04SbdlVyCrPhyRkuk2YcyajQZmVZlPXVErz-9EqSGyDwurrDKj3I8bDtfdnBSqSftfK2OEIMCfNuR555QigQqzpaPUCSrONoC24OfjgSe0SR0GBRQYXkdnLqmL7WDBxgxQhwqKmST6mj8FUe_tDNTRIp5FOZ85_atwuFribWl9QLuB6rWqs_x9Po6zlJuKYL2mSvxPpHd9LRumkpzCal82dpqml2a3ai7_mcN5Nj_glchGG7LrS9C1xfQlTVN-IzCAW4tszs2aK3yuDYL0oRv5DmfTTAQoNNAjObwjS5eoSiQMZT5KxEI-SI17p0hnExuAUzXQfkw'

//   // // Check if we have previously stored a token.
//   fs.readFile(TOKEN_PATH, async (err: any, token: any) => {
//     if (err) return await getGoogleToken(oAuth2Client, callback);
//     oAuth2Client.setCredentials(JSON.parse(token));
//     callback(oAuth2Client);
//   });
// }

// export const sendGamilEmail = (mail: any) => {
//   fs.readFile(path.join(__dirname, 'credentials.json'), (err: any, content: any) => {
//     if (err) return console.log('Error loading client secret file:', err);

//     // Authorize a client with credentials, then call the Gmail API.
//     authorize(JSON.parse(content), sendGmailMail(mail));
//   });
// };

import sgMail from '@sendgrid/mail';
import { KEY_API_SEND_GRID } from './mail/sendgrid/config';
import { buildMailForBO } from './mail/sendgrid/logic';

const message = {
  to: 'jacob@hairun-technology.com',
  from: 'aud.jacobdev@gmail.com',
  subject: 'Fiarabana',
  text: 'Akory aly e!!!',
  html: '<h1>Aomby mola rony e!!!</ht1>',
};

const sendrealMessage = async () => {
  sgMail.setApiKey(KEY_API_SEND_GRID);
  const data = {
    to: 'jacob@hairun-technology.com',
    subject: 'Fiarabana',
    text: 'Akory aly e!!!',
    html: '<h1>Aomby mola rony e!!!</ht1>',
  };
  const newMessage = buildMailForBO({ data });
  sgMail
    .send(newMessage)
    .then((item) => console.log('Email sent to ', data.to))
    .catch((err) => console.log(err));
};

sendrealMessage();
