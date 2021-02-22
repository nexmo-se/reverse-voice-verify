const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
const applicationId = process.env.APPLICATION_ID;
const privateKey = process.env.PRIVATE_KEY;
const voiceHost = process.env.VOICE_HOST;
const voiceLvn = process.env.VOICE_LVN;
const pusherAppId = process.env.PUSHER_APP_ID;
const pusherKey = process.env.PUSHER_KEY;
const pusherSecret = process.env.PUSHER_SECRET;
const pusherCluster = process.env.PUSHER_CLUSTER;
const isVidsInstance = process.env.VIDS_INSTANCE === 'true';

const getEnvConfig = async () => {
  return Promise.resolve({
    apiKey,
    apiSecret,
  
    applicationId,
    privateKey,
  
    voiceHost,
    voiceLvn,
  
    pusherAppId,
    pusherKey,
    pusherSecret,
    pusherCluster,
  });
};

const getVidsConfig = async (token) => {
  return getEnvConfig();
}

const getConfig = async (token) => {
  if (isVidsInstance) {
    return getVidsConfig(token);
  } else {
    return getEnvConfig();
  }
}

module.exports = {
  getConfig,
};
