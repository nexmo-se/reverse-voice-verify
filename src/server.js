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
        type: [ "dtmf", "speech" ],
        dtmf: {
                maxDigits: 6,
                timeOut: 10,
        },
        speech: {
                context:["1","2","3","4","5","6","7","8","9","0"]
        }
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
    console.log(JSON.stringify(req.body));
    let mobileNumber = req.body.to;
    let code = undefined;
    const { speech: sinput, dtmf: dinput } = req.body;
    if(sinput.results instanceof Array && sinput.results.length > 0)
        code = sinput.results[0].text.replace(/\s/g, '');
    else
        code = dinput.digits;
    console.log(code+" "+mobileNumber);
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
