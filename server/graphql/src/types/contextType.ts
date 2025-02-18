/* eslint-disable import/no-extraneous-dependencies */

import { BackOfficeUser, PrismaClient, User } from '@prisma/client';
import { GoogleApis } from 'googleapis/build/src/googleapis';
import { Redis } from 'ioredis';
import { GoogleClient } from '../mail/google/googleClient';
import { OutLookClient } from '../mail/outlook/outlookClient';
import { OAuth2Client } from './types';
import { RedisPubSub } from 'graphql-redis-subscriptions';

export type Context = {
  prisma: PrismaClient;
  pubsub: RedisPubSub;
  currentUser: User | null;
  currentUserBO: BackOfficeUser | null;
  userId: string;
  redis: Redis;
  googleApis: GoogleApis;
  oAuth2Client: OAuth2Client;
  outLookProviderToken: string;
  outLookClient: OutLookClient;
  googleClient: GoogleClient;
};
