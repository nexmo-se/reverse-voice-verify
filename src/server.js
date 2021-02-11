require('dotenv').config();

const axios = require('axios');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const helmet = require('helmet');
const { v4: uuid } = require('uuid');

const voiceService = require('./voice');
const otpService = require('./otp');

const port = process.env.PORT || 8080;

// Always use UTC Timezone
process.env.TZ = 'Etc/UTC';
const requestMaxSize = '150mb';

const app = express();

app.set('trust proxy', true);
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: requestMaxSize }));
app.use(bodyParser.json({ limit: requestMaxSize }));

app.use('/', express.static('public'));
app.get('/success', (_, res) => res.send('You have successfully deployed the Vonage Reverse Voice Verify'));

app.post('inbound/status', async (req, res, next) => {
  try {
    console.log(req.body);
    res.send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.post('inbound/event', async (req, res, next) => {
  try {
    console.log(req.body);
    res.send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.post('/request', async (req, res, next) => {
  try {
    console.log(req.body);
    res.send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});


// Create Application HTTP Server
const httpServer = http.createServer(app);
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
