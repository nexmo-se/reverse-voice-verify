const otpMap = {};

const generate = async (mobileNumber) => {
  try {
    const code = `000000${Math.floor(Math.random() * 100000)}`.slice(-6);
    otpMap[mobileNumber] = {
      code,
      expiry: new Date().getTime() + 300000, // 5 minute expiry
    };
    return Promise.resolve(code);
  } catch (error) {
    return Promise.reject(error);
  }
};

const verify = async (mobileNumber, code) => {
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



module.exports = {
  generate,
  verify,
};
