const otp = require('simpleotp');

const totpSecret = process.env.TOTP_SECRET;
const useRfc6238 = (process.env.TOTP_ENABLE || 'true') === 'true';

const totp = new otp.Totp();
const otpMap = {};

const generateSimple = async (mobileNumber) => {
  try {
    const code = `000000${Math.floor(Math.random() * 100000)}`.slice(-6);
    otpMap[mobileNumber] = {
      code,
      expiry: new Date().getTime() + 30000, // 30 seconds expiry
    };
    return Promise.resolve(code);
  } catch (error) {
    return Promise.reject(error);
  }
};

const verifySimple = async (mobileNumber, code) => {
  try {
    const record = otpMap[mobileNumber];
    if (record == null) {
      console.error('No such record for mobile number');
      return Promise.resolve(false);
    }

    const { code: expectedCode, expiry } = record;
    const currentTime = new Date().getTime();
    if (currentTime > expiry) {
      console.error('Record has expired');
      delete otpMap[mobileNumber];
      return Promise.resolve(false);
    }

    if (code !== expectedCode) {
      console.error('Incorrect code');
      return Promise.resolve(false);
    }

    delete otpMap[mobileNumber];
    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(error);
  }
};

const generateRfc = async (mobileNumber) => {
  try {
    const time = Math.floor(Date.now() / 1000);
    const code = totp.createToken({
      secret: totpSecret,
      num_digits: 6,
      seconds: time,
    });
    otpMap[mobileNumber] = {
      code,
      time,
      expiry: new Date().getTime() + 300000, // 5 minute expiry (300 seconds)
    };
    console.log(otpMap[mobileNumber]);
    return Promise.resolve(code);
  } catch (error) {
    return Promise.reject(error);
  }
};

const verifyRfc = async (mobileNumber, code) => {
  try {
    const record = otpMap[mobileNumber];
    if (record == null) {
      console.error('No such record for mobile number');
      return Promise.resolve(false);
    }
    console.log(record);

    const { code: expectedCode, time} = record;
    if (code !== expectedCode) {
      console.error('Incorrect code');
      return Promise.resolve(false);
    }

    const isValid = totp.validate({
      token: code,
      secret: totpSecret,
      num_digits: 6,
      seconds: time,
    });
    if (!isValid) {
      console.error('Invalid code');
      return Promise.resolve(false);
    }

    delete otpMap[mobileNumber];
    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(error);
  }
};

const generate = useRfc6238 ? generateRfc : generateSimple;
const verify = useRfc6238 ? verifyRfc : verifySimple;

module.exports = {
  generate,
  verify,
};
