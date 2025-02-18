import express from 'express';
import {saveSubscription} from '../helpers/dbHelper';
import axios from "axios";
import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import {refreshUserAccessToken} from "../helpers/utils";


export const mainRouter = express.Router();

mainRouter.get('/', async (req, res) => {
  res.send('Welcome to Yesboss');
});

mainRouter.get('/myapp', async (req, res) => {
  return res.redirect('myapp://callback/reauthenticate');
});
