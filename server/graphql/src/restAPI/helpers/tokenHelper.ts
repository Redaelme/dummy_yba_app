import jwt from 'jsonwebtoken';
import jkwsClient from 'jwks-rsa';

const client = jkwsClient({
  jwksUri: 'https://login.microsoftonline.com/common/discovery/v2.0/keys',
});

export async function getKey(
  header: { [key: string]: any },
  callback: (obj: any, signingKey: string) => void,
) {
  const key: any = await client.getSigningKey(header.kid);
  const signingKey = key.publicKey || key.rsaPublicKey;
  callback(null, signingKey);
}

export function isTokenValid(token: string, appId: string, tenantId: string) {
  return new Promise((resolve) => {
    const options = {
      audience: [appId],
      issuer: [`https://sts.windows.net/${tenantId}/`],
    };
    jwt.verify(token, getKey, options, (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error('Token verification failed:', err);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

export async function checkTokenValidity(token, appId, tenantId) {
  const options = {
    audience: [appId],
    issuer: [`https://sts.windows.net/${tenantId}/`],
  };

  try {
    const verification = await new Promise((resolve, reject) => {
      jwt.verify(token, getKey, options, (err) => {
        if (err) {
          console.error('Token verification failed:', err);
          reject(false);
        } else {
          resolve(true);
        }
      });
    });
    return verification;
  } catch (error) {
    console.error('Error during token validation:', error);
    return false;
  }
}
