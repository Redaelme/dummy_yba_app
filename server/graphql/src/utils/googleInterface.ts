export interface Events {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  description: string;
  colorId: string;
  creator: { email: string; self: boolean };
  organizer: { email: string; self: boolean };
  start: { dateTime: string };
  end: { dateTime: string };
  iCalUID: string;
  sequence: number;
  reminders: { useDefault: boolean; overrides: { method: string; minutes: number }[] };
  eventType: string;
  attendees: { email: string; responseStatus: string; resource?: boolean }[];
  location: string;
  hangoutLink?: string;
  level: string;
}
interface headers {
  name: string;
  value: string;
}
export interface GMailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload: {
    partId: string;
    mimeType: string;
    filename: string;
    headers: headers;
    body: {
      size: number;
    };
    parts: {
      partId: number;
      mimeType: string;
      filename: string;
      headers: headers;
      body: {
        size: number;
      };
    }[];
  };
  sizeEstimate: number;
  historyId: number;
  internalDate: number;
}
export interface RessourcesTypes {
  data: {
    kind: string;
    etag: string;
    items: {
      kind: string;
      etags: string;
      resourceId: number;
      resourceName: string;
      generatedResourceName: string;
      resourceType: string;
      resourceEmail: string;
      capacity: number;
      buildingId: string;
      floorName: number;
      resourceCategory: string;
    }[];
  };
}
export interface RoomsData {
  resourcesId: string | undefined;
  resourceName: string | undefined;
  resourceType: string | undefined;
  generatedResourceName: string | undefined;
  resourceEmail: string | undefined;
  capacity: number | undefined;
  buildingId: string | undefined;
  resourceCategory: string | undefined;
  address: {
    street: string;
    city: string;
    state: string;
    countryOrRegion: string;
    postalCode: string;
  } | null;
}
