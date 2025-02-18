import { AuthManager } from '../auth/authManager';

// Used by Graph client to get access tokens
// See https://github.com/microsoftgraph/msgraph-sdk-javascript/blob/dev/docs/CustomAuthenticationProvider.md
export class GraphAuthProvider {
  getAccessToken = async () => {
    const token = await AuthManager.getAccessTokenAsync();
    return token || '';
  };
}
