import cheerio from 'cheerio';
import log from 'loglevel';
import storage from '../utils/storage';
import request from '../utils/request';
import { LOGIN_URL, DEFAULT_MESSAGES_HOST } from '../constants';
import { getRegistrationTokenParams } from './registrationToken';
import subscribeToResources from '../resource/subscribe';
import { getTimezone, getCurrentTime } from '../utils/helpers';


export async function login(username, password) {
  const { skypeToken, expiryDate } =
    await sendLoginRequest(username, password);
  const { registrationTokenParams, messagesHost } =
    await getRegistrationTokenParams(skypeToken, DEFAULT_MESSAGES_HOST);

  storage.setItem('username', username);
  storage.setItem('skypeToken', skypeToken);
  storage.setItem('stExpiryDate', expiryDate);
  storage.setItem('registrationTokenParams', registrationTokenParams);
  storage.setItem('messagesHost', messagesHost);

  return subscribeToResources(registrationTokenParams, messagesHost);
}

async function sendLoginRequest(username, password) {
  const { pie, etm } = await getFormData();
  const timezone_field = getTimezone(); // eslint-disable-line camelcase
  const js_time = getCurrentTime(); // eslint-disable-line camelcase
  const postData = {
    username,
    password,
    pie,
    etm,
    timezone_field,
    js_time,
  };
  return postLoginForm(postData);

  async function getFormData() {
    let response = await request // eslint-disable-line prefer-const
      .get(LOGIN_URL)
      .end();
    if (response.statusCode === 200) {
      const $ = cheerio.load(response.text);
      const pie = $('input[name="pie"]').val();
      const etm = $('input[name="etm"]').val();
      if (pie && etm) {
        return { pie, etm };
      }
      throw 'Failed to parse pie and etm from login form';
    }
    throw 'Failed to get login form data, code ' + response.statusCode;
  }

  async function postLoginForm(postData) {
    let response = await request // eslint-disable-line prefer-const
      .post(LOGIN_URL)
      .type('form')
      .send(postData)
      .end();
    if (response.statusCode === 200) {
      const $ = cheerio.load(response.text);
      const skypeToken = $('input[name="skypetoken"]').val();
      const skypeTokenExpiresIn = parseInt($('input[name="expires_in"]')
        .val(), 10);
      if (skypeToken && skypeTokenExpiresIn) {
        // skypeTokenExpiresIn is in seconds from now, convert to ISO
        const timestamp = new Date().getTime();
        const expiryDate =
          new Date(timestamp + skypeTokenExpiresIn * 1000).toISOString();
        log.trace('Login request successful');
        return { skypeToken, expiryDate };
      }
      throw 'Login failed, credentials are incorrect or you\'ve' +
        ' hit a CAPTCHA wall: ' + $('.message_error').text();
    } else {
      throw 'Login request failed';
    }
  }
}
