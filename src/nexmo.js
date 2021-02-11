const Nexmo = require('nexmo');

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

const applicationId = process.env.APPLICATION_ID;
const privateKey = process.env.PRIVATE_KEY;

let sanitizedPrivateKey = privateKey;
if (sanitizedPrivateKey.indexOf('-----BEGIN PRIVATE KEY-----') === 0) {
  sanitizedPrivateKey = Buffer.from(sanitizedPrivateKey);
}

const client = new Nexmo({
  // SMS
  apiKey,
  apiSecret,

  // Whatsapp
  applicationId,
  privateKey: sanitizedPrivateKey,
});

const generateBasic = () => {
  const plaintext = `${apiKey}:${apiSecret}`;
  const token = Buffer.from(plaintext).toString('base64');
  return token;
};

const generateJwt = () => client.generateJwt();

module.exports = {
  apiKey,
  apiSecret,

  generateBasic,
  generateJwt,
};
