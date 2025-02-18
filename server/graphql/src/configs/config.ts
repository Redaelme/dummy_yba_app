export const isDev = process.env.TS_NODE_DEV === 'true';
export const adminEmail = process.env.OUTLOOK_ADMIN_EMAIL;
export const adminPassword = process.env.OUTLOOK_ADMIN_PASSWORD;
export const outlookAdminTenantId = process.env.OUTLOOK_ADMIN_TENANT_ID;
export const JWT_SECRET = process.env.JWT_SECRET || 'superSecret';
export const REDIS_TLS = process.env.REDIS_TLS;

export const serverConfiguration = {
  REST_API_PORT: Number(process.env.REST_API_PORT || '4002'),
  REST_API_HOST: process.env.REST_API_HOST || 'localhost',
  GRAPHQL_SERVER_PORT: Number(process.env.GRAPHQL_SERVER_PORT || '4000'),
  REST_API_URL: process.env.REST_API_URL || 'http://localhost:4002',
};

export const subscriptionConfiguration = {
  changeType: process.env.CHANGE_TYPE || '',
  notificationUrl: process.env.NOTIFICATION_URL || '',
  resource: process.env.RESOURCE || '',
  clientState: process.env.CLIENT_STATE || '',
  includeResourceData: false,
};

export const msalConfiguration = {
  authority: process.env.OAUTH_AUTHORITY || '',
  clientID: process.env.OAUTH_APP_ID || '',
  clientSecret: process.env.OAUTH_APP_SECRET || '',
  tenantID: process.env.OUTLOOK_ADMIN_TENANT_ID || '',
  redirectUri: process.env.REDIRECT_URI || '',
};

export const certificateConfiguration = {
  certificateId: 'myCertificateId',
  relativeCertPath: './certificate.pem',
  relativeKeyPath: './key.pem',
  password: 'Password123',
};

export const credentials = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uri: process.env.REDIRECT_URI,
};

export const EmailTemplateStaticFilesPaths = {
  HEADER_BACKGROUND:
    process.env.HEADER_BACKGROUND ||
    'https://firebasestorage.googleapis.com/v0/b/yesboss-316810.appspot.com/o/background.png?alt=media&token=14ad455f-55a0-4da2-b091-6788f3ac93e4',
  LOGO:
    process.env.LOGO ||
    'https://firebasestorage.googleapis.com/v0/b/yesboss-316810.appspot.com/o/logo.png?alt=media&token=84a3b1b4-be2e-4119-8ab3-4664be23f355',
  EMAIL:
    process.env.EMAIL ||
    'https://firebasestorage.googleapis.com/v0/b/yesboss-316810.appspot.com/o/email.png?alt=media&token=f102f687-a052-431a-a72b-d39301ceb446',
  COLORED_LOGO:
    process.env.COLORED_LOGO ||
    'https://firebasestorage.googleapis.com/v0/b/yesboss-316810.appspot.com/o/logo_2.jpeg?alt=media&token=508ba21b-d737-477a-96b6-80e191cd80b7',
  SUBJECT:
    process.env.SUBJECT ||
    'https://firebasestorage.googleapis.com/v0/b/yesboss-316810.appspot.com/o/interests.png?alt=media&token=c74964ab-2c2f-4d68-b36b-7b03d5f864f0',
  LOCATION:
    process.env.LOCATION ||
    'https://firebasestorage.googleapis.com/v0/b/yesboss-316810.appspot.com/o/location.png?alt=media&token=a37cb7d7-0e32-4fbb-8606-a6a5fcf9df21',
  CALENDAR:
    process.env.CALENDAR ||
    'https://firebasestorage.googleapis.com/v0/b/yesboss-316810.appspot.com/o/calendar.png?alt=media&token=2624a0e2-1f7f-4495-bc3e-93837d728665',
  CAMERA:
    process.env.CAMERA ||
    'https://firebasestorage.googleapis.com/v0/b/yesboss-316810.appspot.com/o/camera.png?alt=media&token=6a29457a-c6e1-4c43-8d60-9c0e17d32d99',
};
