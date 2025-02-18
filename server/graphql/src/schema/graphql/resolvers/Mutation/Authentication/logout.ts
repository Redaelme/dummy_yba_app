import { Context } from '../../../../../types/contextType';

export default {
  logout: async (_: any, ctx: Context) => {
    try {
      console.log('##### logout args: #####', ctx);
      const { oAuth2Client, googleClient, prisma } = ctx;

      return true;
    } catch (error) {
      console.log('error=', error);
      return false;
    }
  },
};
