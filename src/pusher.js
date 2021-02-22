const Pusher = require('pusher');

const notifyLogin = (mobileNumber, success = false, appId, key, secret, cluster) => {
  const pusher = new Pusher({
    appId,
    key,
    secret,
    cluster,
    useTLS: true,
  });

  pusher.trigger('auth', 'login', { mobileNumber, success });
}

module.exports = {
  notifyLogin,
};
