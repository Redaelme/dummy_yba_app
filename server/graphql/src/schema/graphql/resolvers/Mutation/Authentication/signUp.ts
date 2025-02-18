import { CalendarTypes, MailService } from '@prisma/client';
import { hash } from 'bcrypt';
import { Context } from '../../../../../types/contextType';
import { findUserOAuth, getAccessTokenAsync } from '../../../../../utils/commonBusinessLogic';
import { EntityTypes, RECEIVED_DATETIME } from '../../../../../utils/constants';
import { NexusGenArgTypes } from '../../../../generated/nexus';
import { AlreadyExistError } from '../../../errors';
import { USER_ALREADY_EXISTS_ERROR } from '../../../errors/messages';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../../../configs/config';
import { RoomsData } from '../../../../../utils/googleInterface';
import { ID_PATH } from '../../../../../mail/google/googleClient';
import nodemailer from 'nodemailer';

const lodash = require('lodash');
// Configure the SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yba@yba.ai', // Your Gmail address
    pass: 'ytuuzjnfgdllfqup',  // Your Gmail password or App Password
  },
});

interface NotificationResult {
  success: boolean;
  token: string | null;
  error?: string;
}

async function ensureNotificationToken(
    prisma,
    userId: string,
    notificationToken: string | null
): Promise<NotificationResult> {
  try {
    if (!notificationToken) {
      console.log(`No notification token provided for user ${userId}`);
      return { success: false, token: null };
    }

    const notification = await prisma.notification.upsert({
      where: { id: userId },
      update: { token: notificationToken},
      create: {
        userId,
        token: notificationToken
      }
    });

    console.info(`Successfully stored notification token for user ${userId}`);
    console.info(`Notification token: ${notification.token}`);
    return { success: true, token: notification.token };
  } catch (error) {
    console.error(`Failed to store notification token for user ${userId}:`, error);
    return { success: false, token: null, error: error.message };
  }
}

export default {
  signUp: async (_: any, { userInput }: NexusGenArgTypes['Mutation']['signUp'], ctx: Context) => {
    const {
      password,
      email,
      mailServiceAuth: { accessToken: token, refreshToken, tokenExpiryDateTime },
      firstName,
      lastName,
      notificationToken,
      id,
      signupCompleted,
      timezone,
      lang
    } = userInput;
    console.log('input:', userInput);
    console.log('timezone====>:', timezone);

    const findUser = await ctx.prisma.user.findFirst({
      where: {
        AND: {
          email,
          signupCompleted: true,
        },
      },
    });

    if (findUser) {
      throw new AlreadyExistError(USER_ALREADY_EXISTS_ERROR, 'email', email, {}, EntityTypes.USER);
    }

    const hashedPassword = await hash(password, 10);
    const mailService = (userInput.mailService as MailService) || 'GOOGLE';
    const calendarType = (userInput.calendarType as CalendarTypes) || 'GOOGLE';
    const { oAuth2Client, googleClient } = ctx;

    const created = await ctx.prisma.user.upsert({
      where: { email },
      update: {
        mailService,
        password: hashedPassword,
        calendarType,
        firstName,
        lastName,
        timezone,
        lang,
        email,
        OAuth: {
          upsert: {
            where: { email: email! },
            create: {
              email,
              refreshToken: refreshToken || '',
              token: token || '',
              tokenExpiryDateTime: tokenExpiryDateTime || '',
            },
            update: {
              email,
              refreshToken: refreshToken || '',
              token: token || '',
              tokenExpiryDateTime: tokenExpiryDateTime || '',
            },
          },
        },
        isActive: true,
        signupCompleted:
            signupCompleted !== null && signupCompleted !== undefined ? signupCompleted : true,
        modeFree: false,
      },
      create: {
        mailService,
        password: hashedPassword,
        calendarType,
        firstName,
        lastName,
        timezone,
        lang,
        email,
        OAuth: {
          create: {
            email,
            refreshToken: refreshToken || '',
            token: token || '',
            tokenExpiryDateTime: tokenExpiryDateTime || '',
          },
        },
        isSingupBO: false,
        isActive: true,
        signupCompleted:
            signupCompleted !== null && signupCompleted !== undefined ? signupCompleted : true,
        modeFree: false,
        isPayed: true,
      },
      include: { OAuth: true },
    });
    console.log('created:', created);

    if (notificationToken) {
      const notificationResult = await ensureNotificationToken(
          ctx.prisma,
          created.id,
          notificationToken
      );

      if (!notificationResult.success) {
        console.error(`Failed to store notification token for user ${created.id}`);
        // throw new Error('Failed to store notification token');
      }
    } else {
      console.log(`No notification token provided for user ${created.id}`);
    }

    let orderData: { buildingId: string; room: RoomsData[] }[] = [];

    if (created.mailService === 'MICROSOFT') {

      const OAuthTokens = await findUserOAuth(created.id, ctx);

      console.log('Found OAuthToken', OAuthTokens[0]);
      const accessToken = await getAccessTokenAsync(OAuthTokens[0], ctx);
      const rooms = await ctx.outLookClient.getRooms(accessToken);
      const buildings = [...new Set(rooms.map((item) => item.buildingId))];

      if (buildings.length > 0) {
        console.log('Microsoft [[room]]:', rooms);
        for (const building of buildings) {
          const itemRooms = rooms.filter((item) => item.buildingId === building);
          const savedaddress = await ctx.prisma.address.create({
            data: {
              userId: created.id,
              adresse: itemRooms[0].address
                  ? `${itemRooms[0].address.street} ${itemRooms[0].address.city} ${itemRooms[0].address.countryOrRegion} `
                  : "Veuillez saisir ici l'adresse complète",
              libelle: itemRooms[0].buildingId || '',
              defaultAddress: itemRooms[0].address ? true : false,
              fromRemote: true,
              Room: {
                create: [
                  ...itemRooms.map((itemRoom) => ({
                    buildingId: itemRoom?.address?.street || '',
                    capacity: itemRoom.capacity || 0,
                    generateResourceName: itemRoom.generatedResourceName || '',
                    resourceCategory: itemRoom.resourceCategory || '',
                    resourceEmail: itemRoom.resourceEmail || '',
                    resourceName: itemRoom.resourceName || '',
                    resourceType: itemRoom.resourceType || '',
                    resourcesId: itemRoom.resourcesId || '',
                  })),
                ],
              },
            },
          });
          const tmprooms = await ctx.prisma.room.findMany();
          console.log('Microsoft [[room]]:', tmprooms);
          console.log('Microsoft [[savedaddress]]:', savedaddress);
        }
      }
    } else if (created.mailService === 'GOOGLE') {
      oAuth2Client.setCredentials({ access_token: token });

      const mail = await ctx.googleClient.getMailMessage(oAuth2Client, 1);
      mail &&
      mail.length > 0 &&
      (await ctx.redis.hset(ID_PATH, created.id, JSON.stringify(mail[0].id)));

      await ctx.googleClient.watchMyLabel(oAuth2Client, created.id, ctx);
      const rdata = await googleClient.getRooms(oAuth2Client);

      if (rdata.length > 0) {
        orderData = lodash
            .chain(rdata)
            .groupBy('buildingId')
            .map((value: RoomsData[], key: string) => ({ buildingId: key, room: value }))
            .value();
        if (orderData) {
          for (const itemRoom of orderData) {
            const createdAddress = await ctx.prisma.address.create({
              data: {
                userId: created.id,
                adresse: itemRoom.room[0].address || '',
                libelle: itemRoom.buildingId,
                defaultAddress: false,
                fromRemote: true,
              },
            });
            for (const itemRoomChild of itemRoom.room) {
              const {
                buildingId,
                capacity,
                generatedResourceName,
                resourceCategory,
                resourceEmail,
                resourceName,
                resourceType,
                resourcesId,
              } = itemRoomChild;
              await ctx.prisma.room.create({
                data: {
                  resourceCategory: resourceCategory || '',
                  buildingId: buildingId || '',
                  capacity: capacity || 0,
                  generateResourceName: generatedResourceName || '',
                  resourceEmail: resourceEmail || '',
                  resourceName: resourceName || '',
                  resourceType: resourceType || '',
                  resourcesId: resourcesId || '',
                  addressId: createdAddress.id,
                },
              });
            }
          }
        }
      }
    }
    await ctx.redis.hset(RECEIVED_DATETIME, created.id, new Date().toISOString());

    console.log('created');
    const accessToken = jwt.sign({ id: created.id }, JWT_SECRET);

    return {
      token: accessToken,
      user: created,
    };
  },
  sinupFromBO: async (
      _: any,
      { userInputBO }: NexusGenArgTypes['Mutation']['singupFromBO'],
      ctx: Context,
  ) => {
    const { input } = userInputBO;

    console.log("[[[login from BO]]]")
    console.log("input", input)
    try {
      input.map(async (item) => {
        const findUser = await ctx.prisma.user.findUnique({
          where: {
            email: item?.email,
          },
        });

        if (findUser) {
          throw new AlreadyExistError(
              USER_ALREADY_EXISTS_ERROR,
              'email',
              item?.email,
              {},
              EntityTypes.USER,
          );
        }

        const hashedPassword = await hash(item?.password, 10);

        await ctx.prisma.user
            .create({
              data: {
                password: hashedPassword,
                firstName: item?.firstName,
                lastName: item?.lastName,
                email: item?.email,
                isSingupBO: true,
                isActive: true,
                signupCompleted: false,
                company: item?.company,
                modeFree: false,
                isPayed: true,
              },
            })
            .then(async () => {
              if (item) {

                const language = "en"
                const frTemplate = `
                <div>
                  <p>Bonjour <strong>${item?.firstName + " " + item?.lastName}</strong>,</p>

                  <p>Félicitations! Votre compte YBA vient d'être créé. Vous pouvez maintenant : </p>

                  <ol>
                      <li>Télécharger YesBoss Assistant sur votre mobile: <a href="https://www.yesbossassistant.com/download-now">LIEN</a></li>
                      <li>Vous connecter à l'application en utilisant vos informations d'accès ci-dessous :<br>
                          <strong>Identifiant:</strong> ${item?.email}<br>
                           <strong>Mot de passe:</strong> ${item?.password}
                      </li>
                  </ol>

                  <p>Cordialement,</p>

                  <p>L'Équipe YBA</p>

              </div>
              `
                const enTemplate = `
                <div>
                  <p>Hello <strong>${item?.firstName + " " + item?.lastName}</strong>,</p>

                  <p>Congratulations! Your YBA account is created. You can now:</p>

                  <ol>
                      <li>Download YesBoss Assistant on your mobile: <a href="https://www.yesbossassistant.com/download-now">LINK</a></li>
                      <li>Log in to the application using the following credentials:<br>
                          <strong>Username:</strong> ${item?.email}<br>
                           <strong>Password:</strong> ${item?.password}
                      </li>
                  </ol>

                  <p>Best regards,</p>

                  <p>The YBA Team</p>

              </div>
              `
                const mailOptions = {
                  from: 'yba@yba.ai',
                  to: item?.email,
                  subject: language === 'fr' ? 'YBA - Vos informations d\'accès à YesBoss Assistant' : 'YBA - Your Login Information for YesBoss Assistant',
                  text: language === 'fr' ? "" : "",
                  html: language === 'fr' ? frTemplate : enTemplate
                };
                try {
                  const info = await transporter.sendMail(mailOptions);
                  console.log('Email sent: ' + info.response);
                } catch (error) {
                  console.error('Error sending email:', error);
                }
              }
            });
      });
      return true;
    } catch (error) {
      throw error;
    }
  },
};