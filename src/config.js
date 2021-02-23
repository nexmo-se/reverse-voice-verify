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
const vidsUtilsPath = process.env.VIDS_UTILS_PATH;

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
  const vidsUtils = require(vidsUtilsPath);
  const nexmoIni = await vidsUtils.getIniStuff();
  await vidsUtils.getDb(nexmoIni)
  const userId = await vidsUtils.getIdFromJWT(nexmoIni, token);
  const rawConfig = await vidsUtils.getNexmo(userId);

  return Promise.resolve({
    apiKey: rawConfig.key,
    apiSecret: rawConfig.secret,
  
    applicationId: rawConfig.app_id,
    privateKey: rawConfig.keyfile,
  
    voiceHost, // From Env
    voiceLvn: rawConfig.vfrom,
  
    pusherAppId: rawConfig.pusher_id,
    pusherKey: rawConfig.pusher_key,
    pusherSecret: rawConfig.pusher_secret,
    pusherCluster,
  });
}

const getConfig = async (token) => {
  if (token === 'localtoken') {
    console.log('Using env config');
    return getEnvConfig();
  } else if (vidsUtilsPath != null && vidsUtilsPath !== '') {
    console.log('Using VIDS config');
    return getVidsConfig(token);
  }

  // Default to Env
  console.log('Using Default (env) config');
  return getEnvConfig();
}

module.exports = {
  getConfig,
};
