import { Context } from '../../../../../types/contextType';
import { NexusGenArgTypes } from '../../../../generated/nexus';
import { generateAccessTokenError } from './const';

export default {
  generateAccessTokenResolvers: async (
    _: any,
    { code }: NexusGenArgTypes['Mutation']['generateAccessToken'],
    ctx: Context,
  ) => {
    let result: {
      token: string;
      refresh_token: string;
      token_type: string;
      expiry_date: number;
    } = {
      token: '',
      refresh_token: '',
      token_type: '',
      expiry_date: 0,
    };
    try {
      const response = await ctx.oAuth2Client.getToken(code);
      // if(response.tokens.)

      console.log('service count==>', response.tokens.scope?.split(' ').length);
      result = {
        token: response.tokens.access_token || '',
        refresh_token: JSON.stringify(response.tokens) || '',
        token_type: response.tokens.token_type || '',
        expiry_date: response.tokens.expiry_date || 0,
      };
    } catch (error: any) {
      console.log('error while generate token', error.response);
      if (!error.response) {
        throw new Error(generateAccessTokenError.MISSING_SERVICES);
      }
      throw new Error((error as any).response.data.error);
    }
    return {
      ...result,
    };
  },
};
