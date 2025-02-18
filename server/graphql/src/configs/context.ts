/* eslint-disable @typescript-eslint/no-var-requires */
import { BackOfficeUser, PrismaClient, User } from '@prisma/client';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { google } from 'googleapis';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import jwt from 'jsonwebtoken';
import { GoogleClient } from '../mail/google/googleClient';
import { OutLookClient } from '../mail/outlook/outlookClient';
import { Context } from '../types/contextType';
import { JWT_SECRET } from './config';

const credentials = require('../mail/google/credentials.json');

export const getCurrentUser = async (
  req: any,
  prisma: PrismaClient,
  redis: Redis.Redis,
): Promise<User | null> => {
  if (req && req.headers && req.headers.authorization) {
    const accessToken = req.headers.authorization.replace('Bearer ', '');
    let payload: object | string = '';

    try {
      payload = await jwt.verify(accessToken, JWT_SECRET);
    } catch (error) {
      return null;
    }

    if (typeof payload !== 'string') {
      const payloadValue = payload as { id: string };
      return prisma.user.findUnique({ where: { id: payloadValue.id } });
    }
  }
  return null;
};

export const getCurrentUserBO = async (
  req: any,
  prisma: PrismaClient,
  redis: Redis.Redis,
): Promise<BackOfficeUser | null> => {
  if (req && req.headers && req.headers.authorization) {
    const accessToken = req.headers.authorization.replace('Bearer ', '');

    let payload: object | string = '';

    try {
      payload = await jwt.verify(accessToken, JWT_SECRET);
    } catch (error) {
      return null;
    }
    if (typeof payload !== 'string') {
      const payloadValue = payload as { id: string };
      return prisma.backOfficeUser.findUnique({ where: { id: payloadValue.id } });
    }
  }
  return null;
};

export const prisma = new PrismaClient();

export const createContext = async (
  { req }: ExpressContext,
  redis: Redis.Redis,
  pubsub: RedisPubSub,
): Promise<Context> => {
  const currentUser = await getCurrentUser(req, prisma, redis);
  const currentUserBO = await getCurrentUserBO(req, prisma, redis);

  const { client_id, redirect_uris, client_secret } = credentials.web;

  const oAuth2Client = new google.auth.OAuth2({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUri: redirect_uris,
  });

  return {
    prisma,
    pubsub,
    currentUser,
    userId: currentUser ? currentUser.id : '',
    redis,
    googleApis: google,
    oAuth2Client,
    outLookProviderToken: '', // To complete later
    outLookClient: new OutLookClient(),
    googleClient: new GoogleClient(),
    currentUserBO,
  };
};

export const validateToken = (token: string) => {
  let userId: string | null = null;

  if (token) {
    let payload: object | string = '';

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      // throw new InvalidTokenError(`Invalid token: ${userToken}`);
      return null;
    }

    if (typeof payload !== 'string') {
      const payloadValue = payload as { id: string };
      userId = payloadValue.id || userId;
    }
  }

  return userId;
};
