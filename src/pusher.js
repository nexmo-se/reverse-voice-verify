const Pusher = require('pusher');

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});


const notifyLogin = (mobileNumber, success = false) => pusher.trigger('auth', 'login', { mobileNumber, success });

module.exports = {
  notifyLogin,
};
