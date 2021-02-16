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
const pusherService = require('./pusher');

const port = process.env.PORT || 8080;
const voiceHost = process.env.VOICE_HOST;

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

app.post('/inbound/answer', async (req, res, next) => {
  try {
    console.log('answer');
    console.log(req.body);
    const ncco = [
      {
        action: 'talk',
        text: 'Please input your 6 digit O T P code',
        bargeIn: true,
      },
      {
        action: 'input',
        eventMethod: 'POST',
        eventUrl: [`${voiceHost}/inbound/dtmfEvent`],
        maxDigits: 6,
        timeOut: 10,
      },
      {
        action: 'talk',
        text: 'Thank you for your input',
      },
    ];
    console.log('ncco');
    console.log(ncco);
    res.json(ncco);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.post('/inbound/event', async (req, res, next) => {
  try {
    console.log('event');
    console.log(req.body);
    res.json([]);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.post('/inbound/dtmfEvent', async (req, res, next) => {
  try {
    console.log('dtmf event');
    console.log(req.body);
    const { dtmf: code, to: mobileNumber } = req.body;
    const verified = await otpService.verify(mobileNumber, code);
    pusherService.notifyLogin(mobileNumber, verified);
    
    const responseNcco = [];
    if (verified) {
      responseNcco.push({
        action: 'talk',
        text: 'You have successfully login.',
      });
    } else {
      responseNcco.push({
        action: 'talk',
        text: 'You have provided an incorrect O T P code. Please try again, thank you.',
      });
    }

    res.json(responseNcco);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.post('/login', async (req, res, next) => {
  try {
    const { mobileNumber } = req.body;
    const code = await otpService.generate(mobileNumber);
    await voiceService.makeVerifyCall(mobileNumber);
    res.json({ mobileNumber, code });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.get('/test', async (req, res, next) => {
  try {
    const mobileNumber = '12345678';
    const code = await otpService.generate(mobileNumber);
    console.log(code);

    const wait = () => new Promise(r => setTimeout(r, 10000));
    await wait();

    const verified = await otpService.verify(mobileNumber, code);
    console.log(verified);
    res.json({ mobileNumber, code });
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
