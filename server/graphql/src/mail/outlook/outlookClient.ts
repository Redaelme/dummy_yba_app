/* eslint-disable class-methods-use-this */
import * as msal from '@azure/msal-node';
import * as graph from '@microsoft/microsoft-graph-client';
import * as handleBars from 'handlebars';
import {
  ISendMEmail,
  MSCalendar,
  MSContact,
  MSEventInput,
  MSGroupGroups,
  MSSingleEvent,
  OnlineMeetingInputs,
  OnlineMeetingResponse,
  OutlookEvent,
  OutlookSchedule,
  ScheduleInformation,
} from '../../types/types';
import {sendCommonNewMessage} from '../../utils/commonBusinessLogic';
import {RoomsData} from '../../utils/googleInterface';
import {GraphErrorTypes, MS_PERSON_TYPE_SUBCLASS} from '../../utils/constants';
import axios from "axios";

require('isomorphic-fetch');

// MSAL config
const msalConfig: msal.Configuration = {
  auth: {
    clientId: process.env.OAUTH_APP_ID || '',
    authority: process.env.OAUTH_AUTHORITY,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Verbose,
    },
  },
};

export class OutLookClient {
  msalClient: msal.PublicClientApplication;

  constructor() {
    this.msalClient = new msal.PublicClientApplication(msalConfig);
  }

  /**
   *
   * @param accessToken Connected user access token
   * @param scheduleInformation Information about the schedule
   */
  getFreeBusyTimes = async (
    accessToken: string,
    scheduleInformation: ScheduleInformation,
  ): Promise<OutlookSchedule> => {
    try {
      const client = getAuthenticatedClient(accessToken);
      const schedules = await client
        .api('/me/calendar/getSchedule')
        // .header('Prefer', 'outlook.timezone="E. Africa Standard Time"')
        .post(scheduleInformation);
      return schedules;
    } catch (error) {
      console.log('error on get free busy', error);
      throw error;
    }
  };

  /**
   *
   * @param accessToken Connected user access token
   * @returns
   */
  async getUserDetails(accessToken: string) {
    const client = getAuthenticatedClient(accessToken);

    const user = await client
      .api('/me')
      .select('displayName,mail,mailboxSettings,userPrincipalName')
      .get();
    return user;
  }

  /**
   *
   * @param accessToken token of the connected user
   * @returns
   *
   */
  async getMailList(accessToken: string, lastDateTimes: string) {
    console.log('Last Date:', lastDateTimes);

    const client = getAuthenticatedClient(accessToken);

    const endpointUrl = `/me/mailFolders/inbox/messages`;

    const messages = await client
      .api(endpointUrl)
      .select('sender,subject,body,bodyPreview,isRead,toRecipients,receivedDateTime')
      .filter('receivedDateTime gt ' + lastDateTimes)
      .top(500)
      .orderby('receivedDateTime desc')
      .get();
    console.log('mail outlook:', messages);

    return messages;
  }

  /**
   * 
   * @param accessToken 
   * @param message 
   * 
   * Send new email 
   * @example const message: ISendMEmail = buildEmail(
      'Proposition de créneaux',
      ['test@yopmail.com','test2@yopmail.com'],
      'slotProposal',
      {
        subject: 'Brainstorming et Budget pour la Campagne Marketing Printemps 2021',
        location: '8 rua Lucce 33100 Milano.',
        calendar: 'Color Trends, Localisation, Models, Budget',
        slots: ['19 Avril 14:00', '19 Avril 16:00', '19 Avril 18:00'],
        choseSlotUrl: '<End-point to use>',
        askOtherSlots: '<Other endpoint to use>',
      },
    );

    await ctx.outLookClient.sendNewMessage(accessToken, message);
   */
  async sendNewMessage(accessToken: string, message: ISendMEmail) {
    const { subject, bccRecipients, body, ccRecipients, from, replyTo, toRecipients } = message;

    const sendMail = {
      message: {
        subject,
        bccRecipients,
        body,
        ccRecipients,
        from,
        replyTo,
        toRecipients,
      },
      saveToSentItems: 'false',
    };
    const sendOutlookEmail = async (mail: any) => {
      const template = handleBars.compile(mail.data.html);

      try {
        const client = getAuthenticatedClient(accessToken);

        const sendMessage = await client.api('/me/sendMail').post({
          ...sendMail,
          message: {
            ...sendMail.message,
            body: { ...sendMail.message.body, content: template({}) },
            subject: mail.data.subject,
          },
        });
      } catch (error) {
        console.log('ERROR :', (error as any).message);
        if (error && (error as any).code === GraphErrorTypes.TRANSIENT) {
          await sendOutlookEmail(mail);
        }
      }
    };
    sendCommonNewMessage(message, sendOutlookEmail);
  }

  /**
   * @description get corresponding user's events
   * @param accessToken user access token
   * @returns
   */
  getEventsList = async (
    accessToken: string,
    dateTimeRanges?: {
      begin: Date;
      end: Date;
    },
  ): Promise<OutlookEvent> => {
    const client = getAuthenticatedClient(accessToken);

    const endpointUrl = dateTimeRanges
      ? `/me/events?$filter=start/dateTime ge '${dateTimeRanges.begin.toISOString()}'and end/dateTime le '${dateTimeRanges.end.toISOString()}'`
      : '/me/events';
    const events = await client
      .api(endpointUrl)
      // .header('Prefer', 'outlook.timezone="Etc/GMT+00"')
      .select('subject,body,bodyPreview,organizer,attendees,start,end,location, isCancelled')
      .get();
    console.log('event is==>', JSON.stringify(events));

    return events;
  };

  /**
   *
   * @param accessToken authenticated user access token
   * @returns
   */
  listGroups = async (accessToken: string): Promise<MSGroupGroups> => {
    const client = getAuthenticatedClient(accessToken);
    const groups = await client.api('/groups').get();
    return groups;
  };

  /**
   *
   * @param accessToken authenticated user access token
   * @returns
   * @description get the user's calendars list
   */
  getCalendars = async (accessToken: string): Promise<MSCalendar> => {
    const client = getAuthenticatedClient(accessToken);
    const res = await client.api('/me/calendars').get();
    return res;
  };

  /**
   *
   * @param accessToken the authenticated user access token
   * @param event event to create
   * @returns
   */
  createEvent = async (accessToken: string, event: MSEventInput, calendarId: string) => {
    const client = getAuthenticatedClient(accessToken);
    try {
      const createdEvent = await client.api(`/me/calendars/${calendarId}/events`).post(event);
      return createdEvent;
    } catch (error) {
      console.log('error when create outlook event:', error);
    }
  };

  /**
   *
   * @param accessToken
   * @param onlineMeetingInputs
   * @returns
   */
  createOnlineMeeting = async (
    accessToken: string,
    onlineMeetingInputs: OnlineMeetingInputs,
  ): Promise<OnlineMeetingResponse> => {
    const client = getAuthenticatedClient(accessToken);
    const onlineMeeting = await client.api(`/me/onlineMeetings`).post(onlineMeetingInputs);
    console.log('onLineMeeting', onlineMeeting);
    return onlineMeeting;
  };

  /**
   *
   * @param accessToken connected user access token
   * @param eventId
   * @description Remove given event from user's shared calendar
   */
  removeEvent = async (accessToken: string, eventId: string) => {
    const client = getAuthenticatedClient(accessToken);

    await client.api(`/me/events/${eventId}`).delete();
  };

  /**
   *
   * @param accessToken Authenticated user access Token
   * @returns
   * @description List all contacts of connected user
   */

  listContacts = async (accessToken: string): Promise<MSContact> => {
    const client = getAuthenticatedClient(accessToken);

    // Function to fetch data with pagination
    const fetchWithPagination = async (endpoint: string) => {
      let allResults: any[] = [];
      let nextLink = endpoint;
      const seenLinks = new Set();  // Track seen nextLink URLs

      try {
        while (nextLink) {
          if (seenLinks.has(nextLink)) {
            console.warn(`Duplicate nextLink detected, stopping pagination: ${nextLink}`);
            break;
          }

          const response = await client.api(nextLink).get();
          allResults = [...allResults, ...response.value];

          seenLinks.add(nextLink);
          nextLink = response['@odata.nextLink'] || null;
        }
      } catch (error) {
        console.error(`Error during pagination on endpoint ${nextLink}:`, error);
        throw new Error(`Failed to fetch data from ${nextLink}`);
      }

      return allResults;
    };

    try {
      let allContacts: any[] = [];

      // Step 1: Fetch all contact folders
      const folders = await fetchWithPagination('/me/contactFolders');
      for (const folder of folders) {
        const folderContacts = await fetchWithPagination(`/me/contactFolders/${folder.id}/contacts?$top=1000`);
        allContacts = [...allContacts, ...folderContacts];
      }

      // Step 2: Fetch contacts from the default folder
      const defaultContacts = await fetchWithPagination('/me/contacts?$top=1000');
      allContacts = [...allContacts, ...defaultContacts];

      // Step 3: Fetch 'people' data for frequently interacted contacts
      const people = await fetchWithPagination('/me/people?$top=1000');
      const otherContacts = people.map((otherContact: any) => ({
        ...otherContact,
        emailAddresses: [
          {
            name: otherContact?.scoredEmailAddresses?.[0]?.address,
            address: otherContact?.scoredEmailAddresses?.[0]?.address,
          },
        ],
      }));

      // Step 4: Fetch sent emails to extract recipient addresses
      const sentEmails = await fetchWithPagination('/me/mailFolders/sentItems/messages?$top=100&$select=toRecipients');
      const sentEmailsList = sentEmails.flatMap((email: any) =>
          email.toRecipients ? email.toRecipients.map((recipient: any) => recipient.emailAddress) : []
      );

      // Step 5: Fetch received emails to extract sender addresses
      const receivedEmails = await fetchWithPagination('/me/messages?$top=100&$select=from,toRecipients');
      const receivedEmailsList = receivedEmails.flatMap((email: any) =>
          email.from ? [email.from.emailAddress] : []
      );

      // Step 6: Combine and deduplicate all email addresses
      const allEmails = [...sentEmailsList, ...receivedEmailsList].filter((email) => email.address); // Remove empty entries
      const uniqueEmails = Array.from(new Map(allEmails.map((email) => [email.address, email])).values());

      // Step 7: Format extracted emails as contacts
      const emailContacts = uniqueEmails.map((email) => ({
        displayName: email.name || email.address,
        emailAddresses: [{ name: email.name, address: email.address }],
      }));

      // Step 8: Combine all sources of contacts
      const combinedContacts = {
        '@odata.context': defaultContacts.length ? defaultContacts[0]['@odata.context'] : '',
        value: [...allContacts, ...otherContacts, ...emailContacts],
      };

      return combinedContacts;
    } catch (error) {
      console.error("Error fetching contacts: ", error);
      throw new Error("Failed to fetch contacts from Outlook.");
    }
  };






  getRooms = async (accessToken: string, ressourceId?: string): Promise<RoomsData[]> => {
    const client = getAuthenticatedClient(accessToken);
    try {
      const rooms = await client.api('/places/microsoft.graph.room').get();

      if (rooms && rooms.value && rooms.value.length) {
        const allRooms: RoomsData[] = rooms.value.map((item: any) => ({
          resourcesId: item.id,
          resourceName: item.nickname || '',
          resourceType: 'salle de réunion',
          generatedResourceName: item.displayName || '',
          resourceEmail: item.emailAddress || 'room@microsoft',
          capacity: +item.capacity || 0,
          buildingId: item.address ? item.address.city : '',
          resourceCategory: 'CONFERENCE_ROOM',
          address: item.address,
        }));
        if (ressourceId) return allRooms.filter((item) => item.resourcesId === ressourceId);

        return allRooms;
      }
      return [];
    } catch (error) {
      return [];
    }
  };

  /******
   * @param
   */
  getEvent = async (accessToken: string, id: string): Promise<MSSingleEvent> => {
    const client = getAuthenticatedClient(accessToken);
    const event = await client
      .api(`/me/events/${id}`)

      .get();

    console.log('Event', JSON.stringify(event));

    return event;
  };
}

/**
 *
 * @param accessToken authenticated user token
 * @returns
 * @description generate new ms graph client according to the connect user access token
 */
export const getAuthenticatedClient = (accessToken: string) => {
  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: (done: graph.AuthProviderCallback) => {
      done(null, accessToken);
    },
  });

  return client;
};

export const getOutlookMessage = async (accessToken: string, messageId: string) => {
  try {

    const emailResponse = await axios.get(
        `https://graph.microsoft.com/v1.0/me/messages/${messageId}?$select=receivedDateTime,internetMessageHeaders,body`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
    );
    console.log('Email Response:', emailResponse.data);
    return  emailResponse.data;

  } catch (error) {
    console.error('Error when getting message by id:', error);
    throw error;
  }
};