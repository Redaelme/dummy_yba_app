/* eslint-disable @typescript-eslint/no-var-requires */
import { BackOfficeUser, PrismaClient, User } from '@prisma/client';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import fs from 'fs';
import { google, GoogleApis } from 'googleapis';
import Redis from 'ioredis';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/config';
import { configureRedis } from '../configs/redis';
import { GoogleClient } from '../mail/google/googleClient';
import { OutLookClient } from '../mail/outlook/outlookClient';
import { Context } from '../types/contextType';

const credentials = require('../mail/google/credentials.json');

const { redis, pubsub } = configureRedis();
export const getCurrentUser = async (
  accessToken: string,
  prisma: PrismaClient,
): Promise<User | null> => {
  let payload: object | string = '';

  try {
    payload = await jwt.verify(accessToken, JWT_SECRET);
  } catch (error) {
    return null;
  }
  // if (!id && typeof id !== 'string') {
  //   return null;
  // }

  if (typeof payload !== 'string') {
    const payloadValue = payload as { id: string };
    return prisma.user.findUnique({ where: { id: payloadValue.id } });
  }

  return null;
};

export const getCurrentUserBO = async (
  accessToken: string,
  prisma: PrismaClient,
): Promise<BackOfficeUser | null> => {
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

  return null;
};

export const prisma = new PrismaClient();

export const createContext = async (accessToken: string): Promise<Context> => {
  const currentUser = await getCurrentUser(accessToken, prisma);
  const currentUserBO = await getCurrentUserBO(accessToken, prisma);
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
