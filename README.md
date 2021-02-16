# Vonage Reverse Voice Verify
This application is to demo a reverse way to verify the mobile number of the user with the use of Voice call and DTMF.

The generation of the TOTP is compliant with RFC 6238 (TOTP) using the following library.

https://github.com/xarenard/simpleotp

# Setup and Installation
This application can be deployed directly to Heroku or a local instance. Follow the guide below for instructions.

### Setup (Heroku)
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/nexmo-se/reverse-voice-verify)


### Setup (Local)
1. Install required softwares: `nodejs`, `npm`, `git`

2. Clone this repo:
```
$ git clone git@github.com:nexmo-se/reverse-voice-verify.git
```

3. Install required dependencies: 
```
npm install
```

4. Setup `.env` according to `.env.example`. 

*This application requires the use of Pusher. You can sign up for a Pusher account at http://pusher.com/.*


# Environment Variables

### Nexmo Related
- API_KEY: Nexmo API Key
- API_SECRET: Nexmo API Secret
- APPLICATION_ID: Nexmo Application ID (with voice capability)
- PRIVATE_KEY: path to private key file or content of private key
- VOICE_HOST: publicly accessible host of this application (domain name or IP address)
- VOICE_LVN: LVN to use for making outbound calls

### Pusher Related
- PUSHER_APP_ID: Pusher App ID (get from pusher dashboard)
- PUSHER_KEY: Pusher Key (get from pusher dashboard)
- PUSHER_SECRET: Pusher Secret (get from pusher dashboard)
- PUSHER_CLUSTER: Pusher Cluster (get from pusher dashboard)

### TOTP Related (RFC 6238)
- TOTP_SECRET: A long secret used to generate the Time-based OTP (RFC 6238 compliant)
- TOTP_USE: (`true` or `false`) Enable and use TOTP instead of a simple Math.random for OTP generation. Defaults to `true`

# Flow
1. User opens the login page on a browser.
2. User inputs a mobile number.
3. User clicks the Login button.
4. System generates an OTP to show on the browser page.
5. System makes an outbound voice call to the mobile number
6. User input the OTP using DTMF.
7. System checks for OTP correctness and validity.
8. User gets notified on the result of login (success/fail) on the browser page.

# API Documentation
### Request for Login
```
POST /login

Body:
{
  "mobileNumber": STRING - mobile number of the user
}
```
