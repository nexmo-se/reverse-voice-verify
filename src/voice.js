const axios = require('axios');
const nexmoService = require('./nexmo');

const voiceHost = process.env.VOICE_HOST;

const getConfig =  (applicationId, privateKey) => {
  const token = nexmoService.generateJwt(applicationId, privateKey);
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const getBody = (mobileNumber, voiceLvn) => ({
  from: {
    type: 'phone',
    number: voiceLvn,
  },
  to: [
    {
      type: 'phone',
      number: mobileNumber,
    },
  ],
  answer_method: 'POST',
  answer_url: [`${voiceHost}/inbound/answer`],
  event_method: 'POST',
  event_url: [`${voiceHost}/inbound/event`],
})

const makeVerifyCall = async (mobileNumber, voiceLvn, applicationId, privateKey) => {
  try {
    const url = 'https://api.nexmo.com/v1/calls';
    const config = getConfig(applicationId, privateKey);
    const body = getBody(mobileNumber, voiceLvn);

    const response = await axios.post(url, body, config);
    const { data } = response;

    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = {
  makeVerifyCall,
};
