import moment from 'moment';
import { Context } from '../../../../../types/contextType';
import { OutlookEmail } from '../../../../../types/types';
import { findUserOAuth, getAccessTokenAsync } from '../../../../../utils/commonBusinessLogic';
import { EntityTypes } from '../../../../../utils/constants';
import { NexusGenObjects } from '../../../../generated/nexus';
import { NotFoundError } from '../../../errors';
import { USER_NOT_FOUND } from '../../../errors/common';
import { USER_NOT_FOUND_ERROR_MESSAGE } from '../../../errors/messages';

export default {
  getConnectedUserEmails: async (
    _: any,
    args: any,
    ctx: Context,
  ): Promise<(NexusGenObjects['OutlookEmail'] | null)[]> => {
    const user = await ctx.prisma.user.findUnique({ where: { id: ctx.userId } });

    if (!user)
      throw new NotFoundError(
        USER_NOT_FOUND_ERROR_MESSAGE,
        'id',
        ctx.userId,
        EntityTypes.USER,
        USER_NOT_FOUND,
      );

    const OAuthTokens = await findUserOAuth(ctx.userId, ctx);

    console.log('Found OAuthToken', OAuthTokens[0]);
    const accessToken = await getAccessTokenAsync(OAuthTokens[0], ctx);
    const messages: OutlookEmail = await ctx.outLookClient.getMailList(
      accessToken,
      moment(new Date()).subtract(1, 'M').toISOString(),
    );

    return messages.value.length
      ? messages.value.map((value) => {
          return {
            bodyPreview: value.bodyPreview,
            id: value.id,
            isRead: value.isRead,
            subject: value.subject,
            sender: {
              name: value.sender.emailAddress.name,
              address: value.sender.emailAddress.address,
            },
            toRecipients:
              value.toRecipients && value.toRecipients.length
                ? value.toRecipients.map((recipient) => {
                    if (recipient) {
                      return {
                        name: recipient.emailAddress.name,
                        address: recipient.emailAddress.address,
                      };
                    }
                    return null;
                  })
                : [],
          };
        })
      : [];
  },
};
