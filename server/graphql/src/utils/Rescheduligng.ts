/* eslint-disable no-await-in-loop */
import moment from 'moment';
import { regleDeGestion } from '../schema/graphql/resolvers/Mutation/Google/regleDeGestion';
import { Context } from '../types/contextType';
import { NotificationTypes } from './constants';
import { sendNotificationPush } from './firebase';

export const rescheduling = async (ids: string[], ctx: Context, fromMobileApp?: boolean) => {
  for (const itemId of ids) {
    const AppointmentData = await ctx.prisma.shedule.findFirst({ where: { eventId: itemId } });
    if (AppointmentData) {
      const {
        id,
        debut,
        fin,
        email,
        reminder,
        GMT: UTC,
        userInvited: invited,
        duration,
        localisation: locationData,
        niveau,
        sujet,
        objet,
        personNumber: capacity,
          lang
      } = AppointmentData;

      const userInvited =
        ((invited as unknown) as {
          email: string;
          required: boolean;
        }[]) || [];
      console.log(' ----------------règle de gestion sur evt supprimé---------------------- ');

      const localisation = { location: locationData, visioConf: true };
      const DateList = [fin, moment(fin).add(30, 'days').toDate()];
      const newDebut = moment(debut).isBefore(moment()) ? moment().toDate() : debut;
      let result: {
        available: boolean;
        start: Date;
        end: Date;
      }[] = [];
      let ignoreShuffle = false;

      for (const dateFin of DateList) {
        result = await regleDeGestion(
          UTC,
          userInvited,
          newDebut,
          dateFin,
          duration,
          email,
          localisation,
          ctx,
          niveau,
          false,
          reminder,
          fromMobileApp,
          sujet,
          objet,
          id,
          'SIMPLE_RESCHEDULING_SLOT',
          undefined,
          undefined,
          undefined,
          capacity || 0,
          true,
          undefined,
          ignoreShuffle,
            null,
            lang,
            ""
        );
        ignoreShuffle = true;
        if (result.length > 0) {
          break;
        }
      }
      if (result.length <= 0) {
        console.log('envoie mail de reparametrage');
        const { currentUser } = ctx;
        if (currentUser) {
          await sendNotificationPush(
              currentUser?.lang === 'fr' ? 'Planification échouée' : 'Scheduling Unsuccessful',
              currentUser?.lang === 'fr' ? `Boss, je n'ai pas pu planifier votre réunion. Veuillez appuyer ici pour l'annuler ou la modifier.` : 'Boss, I couldn\'t schedule your meeting. Please tap here to cancel or modify it.',
            currentUser.email as string,
            { scheduleId: id, type: NotificationTypes.SCHEDULE },
          );
        } else {
          console.log('current existe pas: current User is', currentUser);
        }
      }
    } else {
      console.log('an error was occured or shedule not found');
    }
  }
};
