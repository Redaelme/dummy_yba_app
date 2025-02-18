/* eslint-disable no-shadow */
/* eslint-disable class-methods-use-this */
import 'log-timestamp';
import {PubSub} from '@google-cloud/pubsub';
import {gmail_v1, google, people_v1} from 'googleapis';
import * as handleBars from 'handlebars';
import {configureRedis} from '../../configs/redis';
import {Context} from '../../types/contextType';
import {ISendMEmail, OAuth2Client} from '../../types/types';
import {sendCommonNewMessage} from '../../utils/commonBusinessLogic';
import {NotificationTypes, RECEIVED_DATETIME} from '../../utils/constants';
import {initCronJobForGmailWatch} from '../../utils/cron';
import {Events, RoomsData} from '../../utils/googleInterface';
import {sendNotificationPush} from '../../utils/firebase';
import {checkTokenValidity} from '../../utils/googleLogic';
import {Base64} from 'js-base64';
import moment from 'moment-timezone';
import {CheckIfMeetingRequest} from "../../utils/llm";
import axios from "axios";
import {handleReAuth} from "../../utils/handleReAuth";

const {convert} = require('html-to-text');


export const ID_PATH = 'id.json';

export interface IMessage {
    sender: {
        emailAddress: string;
        name: string;
    };
    recipients: (string | undefined)[];
    cc: (string | undefined)[];
    object: string;
    content: string;
    id: string;
    isRead: boolean;
    payload: any;
    receivedDateTime: string;
    subject: string;
    htmlBody: string;
}
interface IMessageListener {
    id: any;
    data: any;
    attributes: any;
    ack: () => void;
}

export class GoogleClient {
    makeBody(to: any, from: any, subject: any, message: any) {
        const str = [
            'Content-Type: text/html; \n',
            'MIME-Version: 1.0\n',
            'Content-Transfer-Encoding: 7bit\n',
            'to: ',
            to,
            '\n',
            'from: ',
            from,
            '\n',
            'subject: ',
            subject,
            '\n\n',
            message,
        ].join('');
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line new-cap
        const encodedMail = new Buffer.from(str, 'ascii')
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
        return encodedMail;
    }

    sendGmailMail = (mail: any, content: ISendMEmail) => (auth: OAuth2Client) => {
        return new Promise((resolve, reject) => {
            try {
                const template = handleBars.compile(mail.data.html);

                const recipients: string[] = [];
                content.toRecipients?.forEach((item) => {
                    recipients.push(item.emailAddress.address.toString());
                });

                const raw = this.makeBody(recipients, content.from, content.subject.toString(), template(content.params || {}));

                const gmail = google.gmail({version: 'v1', auth});

                gmail.users.messages.send(
                    {
                        userId: 'me',
                        resource: {
                            raw,
                        },
                    },
                    (err: any, res: any) => {
                        if (err) {
                            reject(err);
                        } else if (!res?.data) {
                            resolve([]);
                        } else {
                            resolve(res.data);  // Resolve with the response data from Gmail
                            // console.log('[[[Email response]]]:', res);
                        }
                    },
                );
            } catch (error) {
                reject(error);
            }
        });
    };


    authorize(oAuth2Client: OAuth2Client, callback: any) {
        return callback(oAuth2Client);
    }

    sendGmailEmail = (oAuth2Client: OAuth2Client, emailContent: ISendMEmail) => async (mail: any) => {
        try {
            return await this.authorize(oAuth2Client, this.sendGmailMail(mail, emailContent));
        } catch (error) {
            console.error('Failed to send email:', error);
            throw error;
        }
    };

    sendRealMessage = async (oAuth2Client: OAuth2Client, content: ISendMEmail, lang: string): Promise<any> => {
        try {
            return await sendCommonNewMessage(content, this.sendGmailEmail(oAuth2Client, content), lang);  // Return the response from sendCommonNewMessage
        } catch (error) {
            console.error('Failed to send the real message:', error);
            throw error;  // Propagate the error to the caller
        }
    };


    transformRequest(obj: any) {
        // function to set query parameters
        const str = [];
        // eslint-disable-next-line guard-for-in
        for (const p in obj) str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`);
        return str.join('&');
    }


    getGoogleContacts = async (auth: OAuth2Client): Promise<people_v1.Schema$Person[]> => {
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        const people = google.people({version: 'v1', auth});
        let googleContacts: people_v1.Schema$Person[] = [];

        let nextPageToken: string | undefined = undefined;
        do {
            try {
                const contacts = await people.people.connections.list({
                    resourceName: 'people/me',
                    personFields: 'names,emailAddresses',
                    pageToken: nextPageToken,
                });

                if (contacts.data.connections) {
                    googleContacts.push(...contacts.data.connections);
                }

                nextPageToken = contacts.data.nextPageToken;

                // Respect rate limits with a delay if needed
                await delay(100); // Adjust the delay as per your needs

            } catch (error) {
                console.error('Error fetching contacts:', error);
                if (error.code === 429) {
                    // If rate limit exceeded, wait and retry
                    await delay(1000); // Longer delay on rate limit
                } else {
                    throw error;
                }
            }
        } while (nextPageToken);

        nextPageToken = undefined;
        do {
            try {
                const otherContacts = await people.otherContacts.list({
                    readMask: 'names,emailAddresses',
                    pageToken: nextPageToken,
                });

                if (otherContacts.data.otherContacts) {
                    googleContacts.push(...otherContacts.data.otherContacts);
                }

                nextPageToken = otherContacts.data.nextPageToken;

                await delay(100);

            } catch (error) {
                console.error('Error fetching other contacts:', error);
                if (error.code === 429) {
                    await delay(1000);
                } else {
                    throw error;
                }
            }
        } while (nextPageToken);

        return googleContacts;
    };


    async listMessages(auth: OAuth2Client, query: string, maxResults?: number): Promise<gmail_v1.Schema$ListMessagesResponse> {
        try {
            // Ensure the OAuth2 client is authenticated
            if (!auth.credentials || !auth.credentials.access_token) {
                throw new Error('OAuth2 client is not authenticated.');
            }

            const gmail = google.gmail({ version: 'v1', auth });
            const res = await gmail.users.messages.list({
                userId: 'me',
                q: query,
                maxResults,
                labelIds: ['INBOX', 'CATEGORY_PERSONAL'],
            });

            if (!res || !res.data.messages) {
                return [] as gmail_v1.Schema$ListMessagesResponse;
            }

            return res.data as gmail_v1.Schema$ListMessagesResponse;
        } catch (error) {
            if (error.message === 'OAuth2 client is not authenticated.') {
                console.error('OAuth2 client is not authenticated. Please authenticate the client.');
            } else if (error.code === 401) {
                console.error('Invalid Credentials, refreshing token...');
                try {
                    await auth.refreshAccessToken();
                    console.log('Token refreshed successfully.');
                    // Retry the listMessages after refreshing the token
                    return await this.listMessages(auth, query, maxResults);
                } catch (refreshError) {
                    console.error('Error refreshing token:', refreshError);
                    throw refreshError;
                }
            } else {
                console.error('Error when getting list of messages:', error);
                throw error;
            }
        }
    }

    getMessage = async (auth: OAuth2Client, messagesId: string) => {
        const gmail = google.gmail({version: 'v1', auth});
        // eslint-disable-next-line no-shadow
        return new Promise<gmail_v1.Schema$Message>((resolve, reject) => {
            gmail.users.messages.get(
                {
                    userId: 'me',
                    id: messagesId,
                },
                (err, res) => {
                    if (err) {
                        console.log('error when get message by id:', err.message);
                    }
                    if (!res) {
                        resolve([] as gmail_v1.Schema$Message);
                        return;
                    }

                    resolve(res.data as gmail_v1.Schema$Message);
                },
            );
        });
    };

    getMailMessage = async (auth: OAuth2Client, maxResults?: number, query?: string) => {
        try {
            const {messages} = await this.listMessages(auth, query || '', maxResults);
            console.log('message list:', messages ? messages.length : 0);

            if (messages) {
                // eslint-disable-next-line array-callback-return
                const mess = messages.map((item) => {
                    if (item && item.id) {
                        const temp = this.getMessage(auth, item.id);

                        return temp;
                    }
                });

                const allMessages = await Promise.all(mess);
                let finalResult: IMessage[] = [];
                if (allMessages && allMessages.length) {
                    //  console.log('allMessges ==>', JSON.stringify(allMessages[0]));
                    finalResult = allMessages.reduce<IMessage[]>((acc, message) => {
                        if (message && message.id && message.payload && message.payload.headers) {
                            const sender =
                                message.payload.headers.filter(
                                    (item) => item.name && item.name.toLowerCase() === 'from',
                                ) || [];

                            // const dateHeader = message.payload.headers.find(header => header.name === 'Date');
                            // if (dateHeader) {
                            //   const emailDate = new Date(dateHeader.value);
                            //   const timezone = moment.tz.guess(); // Guess the timezone based on the system time
                            //
                            //   console.log('Email Date:', emailDate);
                            //   console.log('Timezone:', timezone);
                            // } else {
                            //   console.log('Date header not found in the email.');
                            // }

                            const arrayToBuildCc = message.payload.headers.filter(
                                (item) =>
                                    item.name &&
                                    (item.name?.toLocaleLowerCase() === 'cc' ||
                                        item.name?.toLocaleLowerCase() === 'cci'),
                            );

                            const arrayToBuildRec = message.payload.headers.filter(
                                (item) => item.name && item.name?.toLocaleLowerCase() === 'to',
                            );

                            const recipient =
                                arrayToBuildRec &&
                                arrayToBuildRec.length > 0 &&
                                arrayToBuildRec[0].value &&
                                arrayToBuildRec[0].value.includes(',')
                                    ? arrayToBuildRec[0].value.split(',').map((item) => {
                                        const isWithName = item.includes('<');
                                        return isWithName ? item.split('<')[1].split('>')[0] : item;
                                    })
                                    : arrayToBuildRec && arrayToBuildRec.length > 0 && arrayToBuildRec[0].value
                                        ? arrayToBuildRec[0].value.includes('<')
                                            ? [arrayToBuildRec[0].value.split('<')[1].split('>')[0]]
                                            : arrayToBuildRec.map((item) => item.value || '')
                                        : [];

                            const subject =
                                message.payload.headers.filter(
                                    (item) => item.name && item.name?.toLocaleLowerCase() === 'subject',
                                ) || [];

                            const Cc =
                                arrayToBuildCc &&
                                arrayToBuildCc.length > 0 &&
                                arrayToBuildCc[0].value &&
                                arrayToBuildCc[0].value.includes(',')
                                    ? arrayToBuildCc[0].value.split(',').map((item) => {
                                        const isWithName = item.includes('<');
                                        return isWithName ? item.split('<')[1].split('>')[0] : item;
                                    })
                                    : arrayToBuildCc && arrayToBuildCc.length > 0 && arrayToBuildCc[0].value
                                        ? arrayToBuildCc[0].value.includes('<')
                                            ? [arrayToBuildCc[0].value.split('<')[1].split('>')[0]]
                                            : [arrayToBuildCc[0].value]
                                        : [];

                            const object =
                                message.payload.headers.filter(
                                    (item) => item.name && item.name.toLocaleLowerCase() === 'object',
                                ) || [];

                            let body = '';
                            let htmlBody = '';

                            if (
                                message.payload.parts &&
                                message.payload.parts.length &&
                                message.payload.parts[0] &&
                                message.payload.parts[0].body
                            ) {
                                const part = message.payload.parts;

                                if (part[0].mimeType === 'multipart/alternative') {
                                    if (part[0].parts && part[0].parts.length && part[0].parts[0].body) {
                                        body = part[0].parts[0].body.data || '';
                                        body = Base64.decode(body.replace(/-/g, '+').replace(/_/g, '/'));
                                        body = Base64.encode(body.replace(/\r\n/g, '\r'));
                                        htmlBody =
                                            part[0].parts[1] && part[0].parts[1].body
                                                ? part[0].parts[1].body.data || ''
                                                : body;
                                        const test = Base64.decode(htmlBody.replace(/-/g, '+').replace(/_/g, '/'));
                                        body = test
                                            .replace(/<br>/g, '\n')
                                            .replace(/<p(.|\n)*?>/g, '\n')
                                            .replace(/<li(.|\n)*?>/g, '\n')
                                            .replace(/\xa0/gi, ' ');
                                        body = convert(body, {
                                            wordwrap: 130,
                                        });

                                        if (body.search('De :') && body.search('mailto:') && body.search('Envoyé :')) {
                                            body = body.slice(0, body.search('De :'));
                                        }
                                        // console.log(body);

                                        body = Base64.encode(body);
                                    }
                                } else {
                                    body = message.payload.parts[0].body.data || '';
                                    body = Base64.decode(body.replace(/-/g, '+').replace(/_/g, '/'));
                                    body = Base64.encode(body);
                                    htmlBody =
                                        message.payload.parts[1] && message.payload.parts[1].body
                                            ? message.payload.parts[1].body.data || ''
                                            : body;
                                    const test = Base64.decode(htmlBody.replace(/-/g, '+').replace(/_/g, '/'));
                                    body = test
                                        .replace(/<br>/g, '\n')
                                        .replace(/<p(.|\n)*?>/g, '\n')
                                        .replace(/<li(.|\n)*?>/g, '\n')
                                        .replace(/\xa0/gi, ' ');
                                    body = convert(body, {
                                        wordwrap: 130,
                                    });
                                    body = Base64.encode(body);
                                }
                            } else if (message.payload.body && message.payload.body.data) {
                                body = message.payload.body.data;
                                htmlBody = body;
                                // console.log('decode:', Base64.decode(body.replace(/-/g, '+').replace(/_/g, '/')));
                                body = Base64.decode(body.replace(/-/g, '+').replace(/_/g, '/'));
                                const test = Base64.decode(htmlBody.replace(/-/g, '+').replace(/_/g, '/'));

                                body = convert(body, {
                                    wordwrap: 130,
                                });
                                body = Base64.encode(body);
                            }

                            //  console.log('----------------------->', body);
                            const receivedDate = message.payload.headers.filter(
                                (item: any) => item.name.toLowerCase() === 'date',

                                // return new Date();
                            );

                            const res: IMessage = {
                                id: message && message.id ? message.id : '',
                                sender: {
                                    emailAddress:
                                        sender[0].value && sender[0].value.split('<')[1]
                                            ? (sender[0].value.split('<')[1].split('>')[0] as string)
                                            : (sender[0].value as string) || '',
                                    name: sender[0].value ? (sender[0].value.split('<')[0] as string) : '',
                                },
                                recipients: Cc && Cc.length > 0 ? Cc : recipient,
                                content: body ? (body as string).replace(/-/g, '+').replace(/_/g, '/') : '',
                                object: subject[0] ? (subject[0].value as string) : '',
                                subject: object[0] ? (object[0].value as string) : '',
                                cc: Cc || [],
                                isRead: false,
                                payload: message.payload,
                                receivedDateTime: receivedDate[0].value
                                    ? new Date(receivedDate[0].value).toISOString()
                                    : new Date().toISOString(),
                                htmlBody: htmlBody ? htmlBody.replace(/-/g, '+').replace(/_/g, '/') : '',
                            };
                            return [...acc, res];
                        }
                        return acc;
                    }, []);
                }
                return finalResult;
            }
        } catch (error) {
            console.log('error when get users messages', error);
        }
    };




    watchMyLabel = async (oAuth2Client: OAuth2Client, userId: string, ctx: Context) => {

        /* INIT CRON */
        const user = await ctx.prisma.user.findUnique({
            where: {id: userId},
        });
        if (!user) {
            throw new Error('watchMyLabel - User not found');
        }

        await initCronJobForGmailWatch(oAuth2Client, userId, ctx);
        const { redis } = ctx;
        let lastHistoryId: string | undefined = await redis.hget('lastHistoryId', userId);

        await updateAccessToken("watchMyLabel");

        await setupGmailWatch();
        listenForPubSubMessages();

        async function updateAccessToken(label: string) {
            // Retrieve user tokens from your database
            console.log(`${label} , Attempting to update access token for user ID:`, userId);
            // if the user oauthStatus === INACTIVE then return;

            try {
                const user = await ctx.prisma.user.findUnique({
                    where: { id: userId },
                });

                if (user && user.oauthStatus === "ACTIVE") {
                    const userOauth = await ctx.prisma.oAuth.findUnique({
                        where: { email: user.email },
                    });

                    if (userOauth) {
                        // console.log('User OAuth:', userOauth);

                        const verifiedToken = await checkTokenValidity(
                            userOauth.tokenExpiryDateTime || new Date(),
                            oAuth2Client,
                            user.email,
                            userOauth.refreshToken || '',
                            ctx,
                            userOauth.token!,
                        );

                        oAuth2Client.setCredentials({ access_token: verifiedToken });

                        console.log(`${label}, Access token updated successfully for user:`, user.email);
                    } else {
                        console.error(`${label}, OAuth details not found for user:`, user.email);
                        // throw new Error('OAuth details not found for user');
                    }
                } else {
                    console.error(`${label}, User not found/ACTIVE with ID:`, userId);
                    // throw new Error('User not found');
                }
            } catch (error) {
                console.log('Error updating OAuth:', error);
                console.log('Error updating OAuth ==> message:', error.message);
                console.error(`${label}, Error updating OAuth:`, error);
                if (user.oauthStatus === "ACTIVE") await handleReAuth(error, user, ctx.prisma);
                // throw error;
            }
        }
        async function setupGmailWatch() {
            try {
                // Ensure the OAuth2 client is authenticated
                if (!oAuth2Client.credentials || !oAuth2Client.credentials.access_token) {
                    throw new Error('OAuth2 client is not authenticated.');
                }
                await updateAccessToken("setupGmailWatch");
                const gmail = google.gmail({
                    version: 'v1',
                    auth: oAuth2Client,
                });

                const res = await gmail.users.watch({
                    userId: 'me',
                    requestBody: {
                        labelIds: ['INBOX'],
                        topicName: 'projects/yesboss-316810/topics/yessboss_topics',
                    },
                })

                console.log('######################## Gmail MAILBOX watch setup successful #####################', res.data);



                // const resactions = await gmail.users.watch({
                //     userId: 'me',
                //     requestBody: {
                //         labelIds: ['INBOX'],
                //         topicName: 'projects/yesboss-316810/topics/gmail-notifications',
                //     },
                // })
                // console.log('######################## Gmail ACTIONS watch setup successful #####################', resactions.data);



                if (res.data.historyId) {
                    lastHistoryId = res.data.historyId;
                } else {
                    // If historyId is not returned, get the current historyId from user's profile
                    const profileRes = await gmail.users.getProfile({ userId: 'me' });
                    lastHistoryId = profileRes.data.historyId;
                    console.log('Fetched current historyId from profile:', lastHistoryId);
                }
                await redis.hset('lastHistoryId', userId, lastHistoryId);

            } catch (error) {
                console.log('Error setting up Gmail watch:', error);
            }
        }

        /**
         * Processes incoming Pub/Sub messages.
         * @param message Pub/Sub message
         */
        async function handleMessage(message) {
            // console.log(`${new Date()} : ${message.id} : Received message`);
            // console.log("[[[[[[[Message object]]]]]]]", message);
            console.log(`GMessageID :: ${message.id} Received message`);
            // console.log("message", message);
            const user = await ctx.prisma.user.findUnique({
                where: {id: userId},
            });
            if (!user) {
                throw new Error(`GMessageID :: ${message.id}, handleMessage - User not found`);
            }

            try {
                const dataBuffer = message.data;
                if (!dataBuffer) {
                    console.warn('Empty message data.');
                    message.ack();
                    return;
                }

                const dataString = Buffer.from(dataBuffer, 'base64').toString();
                const data = JSON.parse(dataString);

                const historyId = data.historyId;
                console.log(`GMessageID :: ${message.id} - HistoryID :: ${historyId}`);

                // console.log(`${new Date()} :  Processing history ID: ${historyId} for message ID: ${message.id}`);

                // Fetch new messages
                await processHistory(historyId, message);

                // Acknowledge the message
                // message.ack();
            } catch (error) {
                // console.error(`Error processing message, GMessageID :: ${message.id}`, error);
                console.error(`GMessageID :: ${message.id}, Error processing message`, error);

                // Acknowledge the message to prevent re-delivery
                // message.ack(); // Or use message.nack() if you want to retry
            }
        }

        function sleep(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function processHistory(historyId: string, message: IMessageListener) {
            let faildAttempt = 0;
            try {

                const notificationHistoryId = parseInt(historyId, 10);
                const storedHistoryId = lastHistoryId ? parseInt(lastHistoryId, 10) : 0;

                if (notificationHistoryId <= storedHistoryId) {
                    console.log(
                        `GMessageID :: ${message.id} - HistoryID :: ${historyId}, Notification historyId is older or equal to lastHistoryId (${lastHistoryId}). Skipping.`
                    );
                    return;
                }

                // await oAuth2Client.getAccessToken();
                await updateAccessToken(`GMessageID :: ${message.id} - HistoryID :: ${historyId}, processHistory`);
                const gmail = google.gmail({
                    version: 'v1',
                    auth: oAuth2Client,
                });
                console.log(`GMessageID :: ${message.id} - HistoryID :: ${historyId}, gmail authed 01 from [processHistory]`);


                const startHistoryId = lastHistoryId || historyId;

                const historyListRes = await gmail.users.history.list({
                    userId: 'me',
                    startHistoryId: startHistoryId,
                    historyTypes: ['messageAdded'],
                    maxResults: 100,
                });
                console.log(`GMessageID :: ${message.id} - HistoryID :: ${historyId}, historyListRes from [processHistory]`);


                const histories = historyListRes.data.history;

                if (!histories) {
                    // console.log('No new history records.');
                    console.error(`GMessageID :: ${message.id} - HistoryID :: ${historyId}, No new history records [processHistory]`);
                    return;
                }

                for (const history of histories) {
                    if (history.messagesAdded) {
                        for (const messageAdded of history.messagesAdded) {
                            const messageId = messageAdded.message?.id;
                            if (messageId) {
                                await processMessage(messageId, message, historyId);
                            }
                        }
                    }
                }

                // Update lastHistoryId

                lastHistoryId = historyListRes.data.historyId!;
                await redis.hset('lastHistoryId', userId, lastHistoryId);

            } catch (err) {
                console.log("#################### failedAttempt", faildAttempt);
                // console.error('Error processing history:', err);
                console.error(`GMessageID :: ${message.id} - HistoryID :: ${historyId}, Error processing history from [processHistory - catch]`, err.message);

                await updateAccessToken(`GMessageID :: ${message.id} - HistoryID :: ${historyId}, processHistory - catch (400 - 404)`);

                const gmail = google.gmail({
                    version: 'v1',
                    auth: oAuth2Client,
                });
                let profileRes = null;

                try {
                    profileRes = await gmail.users.getProfile({ userId: 'me' });
                    console.log("profiles api sucess");
                }catch (error) {
                    console.log("profiles api failed", user.oauthStatus);
                    console.error(`GMessageID :: ${message.id} - HistoryID :: ${historyId}, Error fetching profile from [processHistory/profileRes - catch]`, error.message);
                    if (user.oauthStatus === "ACTIVE") await handleReAuth(error, user, ctx.prisma);
                }

                const errorCode = err.code || (err.response && err.response.status);
                const errorMessage = err.message || (err.response && err.response.statusText);
                const errors = err.errors || (err.response && err.response.data && err.response.data.errors) || [];

                // Function to check if error message includes specific text
                const errorMessageIncludes = (text: string) => {
                    return (
                        (errorMessage && errorMessage.toLowerCase().includes(text.toLowerCase())) ||
                        errors.some((e: any) => e.message && e.message.toLowerCase().includes(text.toLowerCase()))
                    );
                };

                if ((errorCode === 400 || errorCode === 404 || errorMessageIncludes('Invalid startHistoryId') || errorMessageIncludes('Requested entity was not found')) && faildAttempt < 3) {
                    // console.error('Invalid startHistoryId or historyId not found. Reinitializing lastHistoryId.');
                    console.log(`GMessageID :: ${message.id} - HistoryID :: ${historyId}, Invalid startHistoryId or historyId not found. Reinitializing lastHistoryId. (handling 400 - 404) from [processHistory - catch]`);
                    // Fetch current historyId and set lastHistoryId
                    if (!profileRes) {
                        profileRes = await gmail.users.getProfile({userId: 'me'});
                    }
                    lastHistoryId = profileRes.data.historyId;
                    await redis.hset('lastHistoryId', userId, lastHistoryId);
                    // Retry processing
                    console.log(`GMessageID :: ${message.id} - HistoryID :: ${historyId}, Reinitializing lastHistoryId DONE . (handling 400 - 404) from [processHistory - catch]`);
                    // await processHistory(historyId, message);
                    faildAttempt++;
                } else if (errorCode === 401 && errorMessageIncludes('Invalid Credentials') && faildAttempt < 3) {
                    // console.error('Invalid credentials. Refreshing access token.');
                    console.log(`GMessageID :: ${message.id} - HistoryID :: ${historyId}, Invalid credentials. Refreshing access token. . (handling 401) from [processHistory - catch]`);

                    await updateAccessToken(`GMessageID :: ${message.id} - HistoryID :: ${historyId}, processHistory - catch (401)`);
                    // await processHistory(historyId, message);

                    console.log(`GMessageID :: ${message.id} - HistoryID :: ${historyId}, Reinitializing lastHistoryId DONE . (handling 401) from [processHistory - catch]`);
                    faildAttempt++;
                } else {
                    // console.error('Unhandled error processing history:', err);
                    console.error(`GMessageID :: ${message.id} - HistoryID :: ${historyId}, Unhandled error processing history message.ack(),  from [processHistory - catch]`);

                    // message.ack(); // Acknowledge the message to avoid reprocessing
                }
            }

        }


        async function processMessage(messageId: string, message: IMessageListener, historyId: string) {

            // console.log(`Processing message ID 0001212 from [processMessage] : ${messageId}`);
            console.log(`GMessageID :: ${message.id} - HistoryID :: ${historyId} - MessageID :: ${messageId}, Processing message ID from [processMessage]`);


            await updateAccessToken(`GMessageID :: ${message.id} - HistoryID :: ${historyId} - MessageID :: ${messageId}, processMessage`);

            const gmail = google.gmail({
                version: 'v1',
                auth: oAuth2Client,
            });
            // console.log("gmail authed 02 from [processMessage]")
            console.log(`GMessageID :: ${message.id} - HistoryID :: ${historyId} - MessageID :: ${messageId}, gmail authed 02 from [processMessage]`);

            try {
                const messageRes = await gmail.users.messages.get({
                    userId: 'me',
                    id: messageId,
                    format: 'full', // Use 'metadata' if you don't need the email body
                });
                // console.log('messageRes.data from [processMessage]:');


                const messageData = messageRes.data;
                console.log(`GMessageID :: ${message.id} - HistoryID :: ${historyId} - MessageID :: ${messageId} - MessageDataID :: ${messageData?.id}, messageRes.data DONE from [processMessage]`);
                // console.log('[[[Message]]]:', messageData?.payload?.headers);


                // return if the email is a google calendar notification
                const calendarSender = messageData.payload?.headers?.find(header => header.name?.toLowerCase() === 'sender');
                if (calendarSender?.value?.includes("<calendar-notification@google.com>")) {
                    console.log(`GMessageID :: ${message.id} - HistoryID :: ${historyId} - MessageID :: ${messageId} - MessageDataID :: ${messageData?.id}, Google Calendar notification email. Skipping... from [processMessage]`);
                    message.ack();
                    return;
                }

                // Exclude attachments by not processing parts with attachment MIME types
                // Extract desired data from the message
                const subjectHeader = messageData.payload?.headers?.find(header => header.name === 'Subject');
                const subject = subjectHeader?.value;
                // const fromHeader = messageData.payload?.headers?.find(header => header.name === 'From');
                // const from = fromHeader?.value;

                console.log(`GMessageID :: ${message.id} - HistoryID :: ${historyId} - MessageID :: ${messageId} - MessageDataID :: ${messageData?.id} - Subject :: ${subject}, messageData DONE from [processMessage]`);


                // Process email body if needed
                let body = null;
                const parts = messageData.payload?.parts || [];
                for (const part of parts) {
                    if (part.mimeType === 'text/plain') {
                        body = Buffer.from(part.body?.data || '', 'base64').toString('utf-8');
                    }
                }
                if (body === null) {
                    // console.warn('No email body found.');
                    console.log(`GMessageID :: ${message.id} - HistoryID :: ${historyId} - MessageID :: ${messageId} - MessageDataID :: ${messageData?.id} - Subject :: ${subject}, No email body found from [processMessage]`);

                    // message.ack();
                    return;
                }
                console.log(`GMessageID :: ${message.id} - HistoryID :: ${historyId} - MessageID :: ${messageId} - MessageDataID :: ${messageData?.id} - Subject :: ${subject}, CHECK-1 from [processMessage]`);

                // console.log('Body:', body);
                const {redis} = ctx;

                const processedMessagesLength = await redis.scard('processed_messages');
                console.log(`Number of processed messages: ${processedMessagesLength}`);
                // if processedMessagesLength is a multiple of 10 wait for 10 sec
                if (Number(processedMessagesLength) > 0 && (Number(processedMessagesLength) % 10 === 0)) {
                    console.log('Waiting for 25 seconds...');
                    await sleep(25000);
                }
                // return if the email is a google calendar notification
                const senderheader =
                    messageData.payload.headers.filter(
                        (item) => item.name && item.name.toLowerCase() === 'from',
                    ) || [];
                const senderData = {
                    emailAddress:
                        senderheader[0].value && senderheader[0].value.split('<')[1]
                            ? (senderheader[0].value.split('<')[1].split('>')[0] as string)
                            : (senderheader[0].value as string) || '',
                    name: senderheader[0].value ? (senderheader[0].value.split('<')[0] as string) : '',
                }

                // console.log('[[[sender]]]', senderData);
                console.log(`GMessageID :: ${message.id} - HistoryID :: ${historyId} - MessageID :: ${messageId} - MessageDataID :: ${messageData?.id} - Subject :: ${subject}, - Sender :: ${senderData.emailAddress}, CHECK-2 from [processMessage]`);


                const sender = senderData.emailAddress;
                // console.log("[[sender]]", sender)
                const isProcessed = await redis.sismember('processed_messages', messageData.id);
                if (isProcessed) {
                    // console.log(`Message ID ${messageData.id} already processed.`);
                    console.log(`GMessageID :: ${message.id} - HistoryID :: ${historyId} - MessageID :: ${messageId} - MessageDataID :: ${messageData?.id} - Subject :: ${subject} - Sender :: ${senderData.emailAddress}, already processed from [processMessage]`);
                    message.ack();
                    return;
                }

                await redis.sadd('processed_messages', messageData.id);

                const referencesHeader = messageData.payload?.headers.find(header => header.name === 'References');
                const messageHeader = messageData.payload?.headers.find(header => header.name === 'Message-ID');
                let emailType = 'new';

                // Extract the Date header to determine the timezone
                const dateHeader = messageData.payload.headers.find(header => header.name === 'Date');
                let emailDate = moment();
                let timezone = moment.tz.guess();
                let offset = 0;
                // console.log('Date header:', dateHeader.value);
                if (dateHeader) {
                    emailDate = moment.parseZone(dateHeader.value, "ddd, D MMM YYYY HH:mm:ss ZZ"); // Parse date with timezone
                    timezone = emailDate.toString().split(' ').pop();
                    offset = emailDate.utcOffset() / 60; // Get the timezone offset in minutes
                } else {
                    // console.log('Date header not found in the email.');
                    console.log(`GMessageID :: ${message.id} - HistoryID :: ${historyId} - MessageID :: ${messageId} - MessageDataID :: ${messageData?.id} - Subject :: ${subject} - Sender :: ${senderData.emailAddress}, Date header not found in the email. from [processMessage]`);

                }
                console.log(`GMessageID :: ${message.id} - HistoryID :: ${historyId} - MessageID :: ${messageId} - MessageDataID :: ${messageData?.id} - Subject :: ${subject} - Sender :: ${senderData.emailAddress}, CHECK-3 from [processMessage]`);

                const userToNotify = JSON.parse(Buffer.from(message.data, 'hex').toString('utf-8'));
                const deliveredToHeader = messageData.payload.headers.find(header => header.name.toLowerCase() === 'delivered-to');
                // console.log('Delivered-To:', deliveredToHeader.value);

                const user = await ctx.prisma.user.findUnique({
                    where: {email: deliveredToHeader?.value},
                });
                if (!user) {
                    // console.log('[[User]] not found:', deliveredToHeader?.value, message.data, messageData.payload.headers);
                    console.error(`GMessageID :: ${message.id} - HistoryID :: ${historyId} - MessageID :: ${messageId} - MessageDataID :: ${messageData?.id} - Subject :: ${subject} - Sender :: ${senderData.emailAddress} - UserEmail :: ${deliveredToHeader?.value}, User not found from [processMessage]`, message.data, messageData.payload.headers);
                    // message.ack();
                    return;
                }

                console.log(`GMessageID :: ${message.id} - HistoryID :: ${historyId} - MessageID :: ${messageId} - MessageDataID :: ${messageData?.id} - Subject :: ${subject} - Sender :: ${senderData.emailAddress} - UserEmail :: ${user?.email}, CHECK-4 from [processMessage]`);

                await CheckIfMeetingRequest(
                    body,
                    user.id,
                    timezone,
                    emailDate.format("YYYY-MM-DD"),
                    emailDate.format("HH:mm"),
                    emailType,
                    sender || "",
                    user?.email || "",
                    subject || "",
                    messageHeader?.value || "",
                    referencesHeader?.value,
                    '',
                    "getAcceptedSlot(schedule)",
                    emailDate.format("YYYY-MM-DD"),
                )
                    .then(async (response) => {
                            // console.log('Meeting request processed:', response?.meeting_title);
                            console.log(`GMessageID :: ${message.id} - HistoryID :: ${historyId} - MessageID :: ${messageId} - MessageDataID :: ${messageData?.id} - Subject :: ${subject} - Sender :: ${senderData.emailAddress} - UserEmail :: ${user?.email}, CHECK-5 Processed from [CheckIfMeetingRequest]`);



                            if ((emailType === 'new' && response?.is_meetingrequest && response?.availability) || (emailType === 'reply' && response?.participant_response?.toLowerCase() === 'rescheduling')) {
                                // console.log('New meeting request:');
                                const langsIndex = {
                                    "english": "en",
                                    "french": "fr"
                                }
                                const meetingRequestData = {
                                    contents: JSON.stringify(response),
                                    messageId: messageData.id,
                                    object: "",
                                    typeMail: "",
                                    recipients: "",
                                    sender: "",
                                    htmlBody: "",
                                    location: "",
                                    senderFullName: "",
                                    dateEntity: "",
                                    appointmentUserAction: "",
                                    GMT: offset,
                                    lang: langsIndex[response?.language?.toLowerCase() || "english"],
                                };

                                await ctx.prisma.incomingMeetingRequest.create({
                                    data: {
                                        ...meetingRequestData,
                                        userId: response.user_id,
                                    },
                                });

                                console.log(`GMessageID :: ${message.id} - HistoryID :: ${historyId} - MessageID :: ${messageId} - MessageDataID :: ${messageData?.id} - Subject :: ${subject} - Sender :: ${senderData.emailAddress} - UserEmail :: ${user?.email}, CHECK-6 Processed from [CheckIfMeetingRequest]`);

                                try {

                                    await redis.hset(ID_PATH, user.id, JSON.stringify(messageData.id));
                                    // console.log('1- ######### Send notification to Google user #########');
                                    console.log(`GMessageID :: ${message.id} - HistoryID :: ${historyId} - MessageID :: ${messageId} - MessageDataID :: ${messageData?.id} - Subject :: ${subject} - Sender :: ${senderData.emailAddress} - UserEmail :: ${user?.email}, CHECK-7 ######### Send notification to Google user #########  Processed from [CheckIfMeetingRequest]`);

                                    await sendNotificationPush(
                                        user.lang === 'fr' ? 'Nouvelle demande de réunion reçue' : 'New Meeting Request Received',
                                        `${subject}`,
                                        user.email as string,
                                        {
                                            messageId: messageData.id,
                                            mail: '',
                                            type: NotificationTypes.INCOMING_EMAIL,
                                        },
                                    ).then(() => {
                                        message.ack();
                                    });


                                } catch (error) {
                                    // console.error('error when send notification to google user', error);
                                    console.error(`GMessageID :: ${message.id} - HistoryID :: ${historyId} - MessageID :: ${messageId} - MessageDataID :: ${messageData?.id} - Subject :: ${subject} - Sender :: ${senderData.emailAddress} - UserEmail :: ${user?.email}, error when send notification to google user from [CheckIfMeetingRequest]`, error);
                                }
                            }

                            message.ack();
                    }
                    )
                    .catch((error) => {
                        // console.error('Error processing email:', error);
                        //remove message from processed_messages set
                        redis.srem('processed_messages', messageData.id);
                        console.error(`GMessageID :: ${message.id} - HistoryID :: ${historyId} - MessageID :: ${messageId} - MessageDataID :: ${messageData?.id} - Subject :: ${subject} - Sender :: ${senderData.emailAddress} - UserEmail :: ${user?.email}, Error processing email from [CheckIfMeetingRequest - catch]`, error);
                        // message.ack();
                    });

                // Additional processing as required
            } catch (err) {
                // console.error('Error processing message:', err);
                console.error(`GMessageID :: ${message.id} - HistoryID :: ${historyId} - MessageID :: ${messageId}, Error processing message from [processMessage - catch]`, err);

            }
        }


        /**
         * Initializes the Pub/Sub subscription listener.
         */
         function listenForPubSubMessages() {

            const projectId = 'yesboss-316810';
            const pubSubClient = new PubSub({projectId});
            // const subscription = pubSubClient.subscription(process.env.PUBSUB);

            const subscription = pubSubClient.subscription(process.env.PUBSUB, {
                flowControl: {
                    maxMessages: 10, // Adjust the maximum number of messages your application can process concurrently
                },
            });
            subscription.on('message', handleMessage);

            subscription.on('error', (error) => {
                console.error('Pub/Sub Subscription Error:', error);
            });

            console.log('Listening for new emails...');
        }


        /**
         * handle retry logic with exponential backoff
         */

        function isRetryableError(error: any) {
            const statusCode = error.code || (error.response && error.response.status);
            const errorMessage = error.message || (error.response && error.response.statusText) || '';
            const errors = error.errors || (error.response && error.response.data && error.response.data.errors) || [];

            // Check for rate limit errors
            const rateLimitStatusCodes = [403, 429];
            const rateLimitMessages = [
                'Rate Limit Exceeded',
                'User-rate limit exceeded',
                'Quota exceeded',
                'Quota exceeded for quota metric',
                // 'No access, refresh token or API key is set',
                // 'Request failed with status code 500',
            ];

            const isRateLimitError = (
                rateLimitStatusCodes.includes(statusCode) &&
                (
                    rateLimitMessages.some(msg => errorMessage.includes(msg)) ||
                    errors.some((e: any) => rateLimitMessages.some(msg => e.message.includes(msg)))
                )
            );

            // Check for network errors
            const networkErrors = ['ENOTFOUND', 'ECONNRESET', 'ETIMEDOUT'];
            const isNetworkError = networkErrors.includes(error.code);

            // Check for backend errors
            const isBackendError = statusCode === 503 || errorMessage.includes('Backend Error');

            return isRateLimitError || isNetworkError || isBackendError;
        }

        async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 5, delay = 1000): Promise<T> {
            let attempt = 0;
            while (attempt <= retries) {
                try {
                    console.log(`GMessageID :: ***  - HistoryID :: ***, handle retries - ${attempt},  from [retryWithBackoff]`);
                    return await fn();
                } catch (error) {
                    console.log("############## error message ##############", error.message);
                    console.log(`GMessageID :: ***  - HistoryID :: ***, handle retries - ${attempt}, ERROR from [retryWithBackoff - catch]`, error);
                    if (isRetryableError(error)) {
                        console.log(`GMessageID :: ***  - HistoryID :: ***, handle retries + isRetryableError TRUE - ${attempt}, ERROR from [retryWithBackoff - catch]`, error);
                        const backoff = Math.pow(2, attempt) * delay;
                        const jitter = Math.floor(Math.random() * delay);
                        const waitTime = backoff + jitter;
                        console.warn(`GMessageID :: ***  - HistoryID :: ***, handle retries + isRetryableError TRUE - ${attempt}, Retryable error encountered. Retrying in ${(waitTime / 1000).toFixed(2)} seconds... (Attempt ${attempt + 1}/${retries})`);

                        await sleep(waitTime);
                        attempt++;
                    } else {
                        throw error; // Non-retryable error, rethrow
                    }
                }
            }
            throw new Error('Maximum retries exceeded.');
        }

    };




    listenForMessages = async (auth: any, ctx: Context) => {
        const projectId = 'yesboss-316810';
        const pubSubClient = new PubSub({projectId});

        // References an existing subscription
        const subscription = pubSubClient.subscription(process.env.PUBSUB, {
            flowControl: {
                maxMessages: 10, // Adjust the maximum number of messages your application can process concurrently
            },
        });
        // Create an event handler to handle messages
        const messageCount = 0;
        const messageHandler = async (message: {
            id: any;
            data: any;
            attributes: any;
            ack: () => void;
        }) => {
            try {
                await this.getMessageListenerMessage(auth, message.data, ctx, message);
                message.ack();
            } catch (error) {
                console.error('Error handling message:', error);
                message.ack(); // ack the message to allow re-delivery if necessary
            }
        };

        const errorHandler = (error: any) => {
            // Do something with the error
            console.error(`ERROR: ${error}`);
            // throw error;
        };

        // Listen for new messages until timeout is hit
        subscription.on('message', messageHandler);
        subscription.on('error', errorHandler);
    };

    getMessageListenerMessage = async (
        auth: OAuth2Client,
        startHistoryId: any,
        ctx: Context,
        message: {
            id: any;
            data: any;
            attributes: any;
            ack: () => void;
        },
    ) => {
        try {

            const userToNotify = JSON.parse(Buffer.from(message.data, 'hex').toString('utf-8'));
            const user = await ctx.prisma.user.findUnique({
                where: {email: userToNotify.emailAddress},
            });



            // console.log(`===================> user to notify: ${user} <==================`);

            if (user) {
                const userOauth = await ctx.prisma.oAuth.findUnique({
                    where: {email: user.email as string},
                });

                // console.log(
                //   `UserOauth ################ userId: ${user.id} userOauth: ${JSON.stringify(userOauth)}`,
                // );
                const oAuth2Client = auth;

                if (userOauth && userOauth.refreshToken) {
                    const {redis} = ctx;
                    const email = userOauth.email;
                    const verifiedToken = await checkTokenValidity(
                        userOauth.tokenExpiryDateTime || new Date(),
                        oAuth2Client,
                        email,
                        userOauth.refreshToken || '',
                        ctx,
                        userOauth.token!,
                    );

                    // console.log({ verifiedToken });
                    oAuth2Client.setCredentials({access_token: verifiedToken});

                    const redisLastReceivedDateTime = await redis.hget(RECEIVED_DATETIME, user.id);
                    const lastReceivedDateTime = redisLastReceivedDateTime
                        ? await redis.hget(RECEIVED_DATETIME, user.id)
                        : moment(new Date()).toISOString();
                    let query = 'after:' + moment(lastReceivedDateTime).unix();

                    // eslint-disable-next-line no-shadow
                    const mail = await this.getMailMessage(oAuth2Client, 1, query);
                    if (mail && mail[0]) {


                        // return if the email is a google calendar notification
                        const sender = mail[0].payload?.headers.find(header => header.name?.toLowerCase() === 'sender');
                        console.log("sender", sender)
                        if (sender?.value?.includes("<calendar-notification@google.com>")) return;

                        const isProcessed = await redis.sismember('processed_messages', mail[0].id);
                        if (isProcessed) {
                            console.log(`Message ID ${mail[0].id} already processed.`);
                            message.ack();
                            return;
                        }

                        await redis.sadd('processed_messages', mail[0].id);

                        const referencesHeader = mail[0].payload?.headers.find(header => header.name === 'References');
                        const messageHeader = mail[0].payload?.headers.find(header => header.name === 'Message-ID');
                        let emailType = 'new';
                        let schedule = null;
                        if (referencesHeader) {
                            return;
                            emailType = 'reply';
                            schedule = await ctx.prisma.shedule.findFirst({
                                where: {
                                    messageId: {
                                        contains: referencesHeader?.value?.split(' ')[0],
                                    }
                                },
                            });

                        }

                        // Extract the Date header to determine the timezone
                        const dateHeader = mail[0].payload.headers.find(header => header.name === 'Date');
                        let emailDate = moment();
                        let timezone = moment.tz.guess();
                        let offset = 0;
                        if (dateHeader) {
                            emailDate = moment.parseZone(dateHeader.value, "ddd, D MMM YYYY HH:mm:ss ZZ"); // Parse date with timezone
                            timezone = emailDate.toString().split(' ').pop();
                            offset = emailDate.utcOffset() / 60; // Get the timezone offset in minutes
                        } else {
                            console.log('Date header not found in the email.');
                        }

                        // if (emailType === 'new') {
                        //     const meetingRequest = await ctx.prisma.incomingMeetingRequest.findUnique({
                        //         where: {
                        //             messageId: mail[0].id,
                        //         },
                        //     }).catch((error) => {
                        //         console.log('error:', error);
                        //     });
                        //     if (meetingRequest) {
                        //         console.log('Meeting request already exists in the database');
                        //         return;
                        //     }
                        // }

                        // if (emailType === 'reply') {
                        //
                        //     const scheduleExist = await ctx.prisma.shedule.findFirst({
                        //         where: {
                        //             id: schedule?.id,
                        //             status: 'PENDING'
                        //         },
                        //     }).catch((error) => {
                        //         console.log('error:', error);
                        //     });
                        //     if (scheduleExist) console.log("ok")
                        //     else {
                        //         console.log('Schedule already confirmed');
                        //         return;
                        //     }
                        // }


                        let decodedContent = Base64.decode(mail[0].content);

                        if (emailType === 'reply') {
                            const replyDelimiters = [
                                'On', // Common in many email clients
                                '-----Original Message-----', // Common in Outlook
                                'From:', // Common in Gmail and others
                            ];

                            // Try to find the first delimiter and split the content there
                            for (const delimiter of replyDelimiters) {
                                const delimiterIndex = decodedContent.indexOf(delimiter);
                                if (delimiterIndex !== -1) {
                                    decodedContent = decodedContent.substring(0, delimiterIndex).trim();
                                    break;
                                }
                            }
                        }
                        const getAcceptedSlot = (schedule: any) => {
                            if (schedule?.eventId?.length > 0) {
                                return `${moment(schedule?.acceptedSlot).format('DD MMMM, HH:mm')} - ${moment(schedule?.acceptedSlot).add(parseInt(schedule?.duration), 'minutes').format('HH:mm')}`;
                            }
                            return '';
                        }
                        await CheckIfMeetingRequest(
                            decodedContent,
                            user.id,
                            timezone,
                            emailDate.format("YYYY-MM-DD"),
                            emailDate.format("HH:mm"),
                            emailType,
                            mail[0].sender.emailAddress,
                            messageHeader?.value || "",
                            referencesHeader?.value,
                            schedule?.reservedSlot || '',
                            getAcceptedSlot(schedule),
                            emailDate.format("YYYY-MM-DD"),
                        )
                            .then(async (response) => {
                                if (emailType === 'reply') {
                                    // console.log('This email is a reply to another email.', response);
                                    // get the response
                                    // reformate to the slots format
                                    if (response?.participant_response?.toLowerCase() === 'accepted') {
                                        const availabileSlots = response.availability.map(slot => {
                                            const startDate = moment(`${slot.start_date} ${slot.start_time}`, 'DD/MM/YYYY HH:mm').toISOString();
                                            const endDate = moment(`${slot.end_date} ${slot.end_time}`, 'DD/MM/YYYY HH:mm').toISOString();
                                            return {
                                                start: startDate,
                                                end: endDate,
                                                available: true
                                            };
                                        });
                                        console.log('[[[availabileSlots]]]:', availabileSlots);
                                        // get the token userOauth.
                                        const token = schedule?.usertoken;
                                        console.log('[[[====token0000]]]:', token);
                                        // send the availabileSlots and token by a formdata to the endpoint /api/availability
                                        const data = {
                                            token: token,
                                            slots: availabileSlots.map(slot => JSON.stringify(slot))
                                        };

                                        try {
                                            const response = await axios.post(`${process.env.REST_API_URL}/slot/confirmChoice`, data, {
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                timeout: 5000, // Set a timeout of 5 seconds
                                            });
                                            console.log('response:', response.data);
                                        } catch (error) {
                                            if (error.code === 'ECONNRESET') {
                                                console.error('Connection was reset. The server might be down or not responding.');
                                            } else if (error.code === 'ECONNABORTED') {
                                                console.error('Request timed out.');
                                            } else {
                                                console.error('An error occurred:', error.message);
                                            }
                                        }

                                    }
                                    if (response?.participant_response?.toLowerCase() === 'alternative slot') {
                                        console.log('Alternative slot');
                                        // get api to this url API/slot/askOther/{token}
                                        try {
                                            const url = `${process.env.REST_API_URL}/slot/${user.lang}/askOther/${schedule?.usertoken}`;
                                            console.log('[[[url]]]:', url);
                                            await axios.get(url, {
                                                timeout: 5000, // Set a timeout of 5 seconds
                                            });
                                        } catch (error) {
                                            if (error.code === 'ECONNRESET') {
                                                console.error('Connection was reset. The server might be down or not responding.');
                                            } else if (error.code === 'ECONNABORTED') {
                                                console.error('Request timed out.');
                                            } else {
                                                console.error('An error occurred:', error.message);
                                            }
                                        }

                                    }
                                    // if (response?.participant_response?.toLowerCase() === 'rescheduling') {
                                    //     console.log('Rescheduling');
                                    //
                                    // }
                                    if (response?.participant_response?.toLowerCase() === 'declined') {
                                        console.log('Declined');
                                    }

                                }
                                if ((emailType === 'new' && response?.is_meetingrequest && response?.availability) || (emailType === 'reply' && response?.participant_response?.toLowerCase() === 'rescheduling')) {
                                    console.log('New meeting request:');
                                    const langsIndex = {
                                        "english": "en",
                                        "french": "fr"
                                    }
                                    const meetingRequestData = {
                                        contents: JSON.stringify(response),
                                        messageId: mail[0].id,
                                        object: "",
                                        typeMail: "",
                                        recipients: "",
                                        sender: "",
                                        htmlBody: "",
                                        location: "",
                                        senderFullName: "",
                                        dateEntity: "",
                                        appointmentUserAction: "",
                                        GMT: offset,
                                        lang: langsIndex[response?.language?.toLowerCase() || "english"],
                                    };
                                    // console.log("mail[0]", mail[0])
                                    // console.log("mail[0].id", mail[0].id)
                                    // console.log('meetingRequestData:', meetingRequestData);

                                    await ctx.prisma.incomingMeetingRequest.create({
                                        data: {
                                            ...meetingRequestData,
                                            userId: response.user_id,
                                        },
                                    });
                                    try {

                                        const content = mail[0].subject.length
                                            ? mail[0].subject
                                            : mail[0].object.length
                                                ? mail[0].object
                                                : Base64.decode(mail[0].content);
                                        const data = await redis.hget(ID_PATH, user.id);

                                        // wait 10 seconds before sending the notification
                                        console.log('wait 10 seconds before sending the notification');
                                        await new Promise((resolve) => setTimeout(resolve, 10000));
                                        console.log('after 10 seconds');
                                        if (data) {
                                            console.log('data:', data)
                                            const id = JSON.parse(data);
                                            if (
                                                id !== mail[0].id &&
                                                moment(mail[0].receivedDateTime).diff(lastReceivedDateTime) > 0
                                            ) {
                                                // console.log('1111=>send message to ', user.id);
                                                await redis.hset(ID_PATH, user.id, JSON.stringify(mail[0].id));

                                                console.log('1- ######### Send notification to Google user #########');
                                                await sendNotificationPush(
                                                    user.lang === 'fr' ? 'Nouvelle demande de réunion reçue' : 'New Meeting Request Received',
                                                    `${content}`,
                                                    email as string,
                                                    {
                                                        messageId: mail[0].id,
                                                        mail: '',
                                                        type: NotificationTypes.INCOMING_EMAIL,
                                                    },
                                                ).then(() => {
                                                    message.ack();
                                                });
                                            } else {
                                                console.log('même id');
                                                message.ack();
                                            }
                                        } else {
                                            await redis.hset(ID_PATH, user.id, JSON.stringify(mail[0].id));
                                            console.log(' after stock send message to ', user.id);

                                            const isNotPassedDate =
                                                moment(mail[0].receivedDateTime).diff(lastReceivedDateTime) > 0;

                                            if (isNotPassedDate) {
                                                console.log('2- ######### Send notification to Google user #########');
                                                await sendNotificationPush(
                                                    user.lang === 'fr' ? 'Nouvelle demande de réunion reçue' : 'New Meeting Request Received',
                                                    `${content}`,
                                                    email as string,
                                                    {
                                                        messageId: mail[0].id,
                                                        mail: ' ',
                                                        type: NotificationTypes.INCOMING_EMAIL,
                                                    },
                                                ).then(() => {
                                                    message.ack();
                                                });
                                            }
                                        }


                                    } catch (error) {
                                        console.log('error:', error);
                                    }
                                    console.log('New meeting request saved:');
                                }

                            })
                            .catch((error) => {
                                console.log('error:', error);
                            });
                    }
                } else {
                    message.ack();
                    console.log('missing User');
                }
            }
        } catch (error) {
            console.log('error when get message:', error);
        }
    };

    getRooms = (auth: OAuth2Client, maxResults?: number) => {
        const service = google.admin({version: 'directory_v1', auth});

        // Function to get detailed info for a single resource
        const getResourceDetails = async (customer: string, calendarResourceId: string) => {
            try {
                const resourceDetailResponse = await service.resources.calendars.get({
                    customer,
                    calendarResourceId,
                });
                return resourceDetailResponse.data;
            } catch (error) {
                console.error(`Failed to fetch details for resource: ${calendarResourceId}`, error);
                return null;
            }
        };

        // Function to get building details
        const getBuildingDetails = async (customer: string, buildingId: string) => {
            try {
                const buildingDetailResponse = await service.resources.buildings.get({
                    customer,
                    buildingId,
                });
                return buildingDetailResponse.data;
            } catch (error) {
                console.error(`Failed to fetch building details for building: ${buildingId}`, error);
                return null;
            }
        };

        return new Promise<RoomsData[]>((resolve, reject) => {
            service.resources.calendars.list(
                {
                    customer: 'my_customer',
                    maxResults,
                },
                async (err, res) => {
                    if (err || !res) {
                        resolve([]);
                        return;
                    }

                    if (res) {
                        const calendarRessources = res.data.items;

                        if (calendarRessources && calendarRessources.length) {
                            // Fetch detailed info for all resources
                            const detailedResourcesPromises = calendarRessources.map(async (calendarRessource) => {
                                const resourceDetail = await getResourceDetails('my_customer', calendarRessource.resourceId);
                                let address = null;
                                if (resourceDetail && resourceDetail.buildingId) {
                                    const buildingDetail = await getBuildingDetails('my_customer', resourceDetail.buildingId);
                                    address = buildingDetail ? buildingDetail.address : null;
                                }

                                return {
                                    resourcesId: calendarRessource.resourceId || '',
                                    resourceName: calendarRessource.resourceName || '',
                                    resourceType: calendarRessource.resourceType || '',
                                    generatedResourceName: calendarRessource.generatedResourceName || '',
                                    resourceEmail: calendarRessource.resourceEmail || '',
                                    capacity: calendarRessource.capacity || 0,
                                    buildingId: calendarRessource.generatedResourceName
                                        ? calendarRessource.generatedResourceName?.split('-')[0].toUpperCase() || ''
                                        : calendarRessource.buildingId || '',
                                    resourceCategory: calendarRessource.resourceCategory || '',
                                    address: `${address?.addressLines.join(', ')}, ${address?.locality}, ${address?.postalCode}, ${address?.regionCode}`
                                };
                            });
                            const detailedResources = await Promise.all(detailedResourcesPromises);
                            resolve(detailedResources);
                        } else {
                            console.log('No resources found.');
                            resolve([]);
                        }
                    }
                }
            );
        });
    };

    getEvent = async (
        oAuthClient: OAuth2Client,
        eventId: string,
        calendarId: string,
    ): Promise<Events> => {
        const calendar = google.calendar({version: 'v3', auth: oAuthClient});

        try {
            const event = await calendar.events.get({
                calendarId,
                eventId,
            });

            const {
                kind,
                etag,
                id,
                status,
                htmlLink,
                created,
                updated,
                summary,
                description,
                colorId,
                creator,
                organizer,
                start,
                end,
                iCalUID,
                sequence,
                reminders,
                attendees,
                location,
                hangoutLink,
            } = event.data;
            return {
                kind,
                etag,
                id,
                status,
                htmlLink,
                created,
                updated,
                summary,
                description,
                colorId,
                creator,
                organizer,
                start,
                end,
                iCalUID,
                sequence,
                reminders,
                attendees,
                location,
                hangoutLink,
            } as Events;
        } catch (error) {
            console.log('error while getting event');
            throw error;
        }
    };
}
