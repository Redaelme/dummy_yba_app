import pem from 'pem';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

function ensureOpenSsl() {
  if (os.platform() === 'win32') {
    pem.config({ pathOpenSSL: 'C:/Program Files/OpenSSL-Win64/bin/openssl.exe' });
  }
}

export function createSelfSignedCertificateIfNotExists(
  certPath: string,
  keyPath: string,
  password: string,
) {
  const certFullPath = path.join(__dirname, certPath);
  return new Promise((resolve) => {
    if (!fs.existsSync(certFullPath)) {
      ensureOpenSsl();
      pem.createCertificate(
        { selfSigned: true, serviceKeyPassword: password, days: 365 },
        (err, result) => {
          if (err) {
            // eslint-disable-next-line no-console
            console.error(err);
          }
          fs.writeFileSync(certFullPath, result.certificate);
          fs.writeFileSync(path.join(__dirname, keyPath), result.serviceKey);
          resolve({});
        },
      );
    } else {
      resolve({});
    }
  });
}

export function getSerializedCertificate(certPath: string) {
  const pfx = fs.readFileSync(path.join(__dirname, certPath));
  const pfxAsString = pfx.toString().replace(/(\r\n|\n|\r|-|BEGIN|END|CERTIFICATE|\s)/gm, '');
  return pfxAsString;
}

export function getPrivateKey(keyPath: string) {
  const privateKey = fs.readFileSync(path.join(__dirname, keyPath), 'utf8');
  return privateKey;
}

export function decryptSymetricKey(base64encodedKey: any, keyPath: string) {
  const asymetricPrivateKey = getPrivateKey(keyPath);
  const decodedKey = Buffer.from(base64encodedKey, 'base64');
  const decryptedSymetricKey = crypto.privateDecrypt(asymetricPrivateKey, decodedKey);
  return decryptedSymetricKey;
}

export function decryptPayload(base64encodedPayload: any, decryptedSymetricKey: any) {
  const iv = Buffer.alloc(16, 0);
  decryptedSymetricKey.copy(iv, 0, 0, 16);
  const decipher = crypto.createDecipheriv('aes-256-cbc', decryptedSymetricKey, iv);
  let decryptedPayload = decipher.update(base64encodedPayload, 'base64', 'utf8');
  decryptedPayload += decipher.final('utf8');
  return decryptedPayload;
}

export function verifySignature(
  base64encodedSignature: string,
  base64encodedPayload: any,
  decryptedSymetricKey: Buffer,
) {
  const hmac = crypto.createHmac('sha256', decryptedSymetricKey);
  hmac.write(base64encodedPayload, 'base64');
  return base64encodedSignature === hmac.digest('base64');
}
