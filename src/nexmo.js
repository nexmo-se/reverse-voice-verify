const Nexmo = require('nexmo');

const generateBasic = (apiKey, apiSecret) => {
  const plaintext = `${apiKey}:${apiSecret}`;
  const token = Buffer.from(plaintext).toString('base64');
  return token;
};

const generateJwt = (applicationId, privateKey) => {
  let sanitizedPrivateKey = privateKey;
  if (sanitizedPrivateKey.indexOf('-----BEGIN PRIVATE KEY-----') === 0) {
    sanitizedPrivateKey = Buffer.from(sanitizedPrivateKey);
  }
  
  const client = new Nexmo({
    applicationId,
    privateKey: sanitizedPrivateKey,
  });
  return client.generateJwt();
};

module.exports = {
  generateBasic,
  generateJwt,
};
