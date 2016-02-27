import cheerio from 'cheerio';
import Promise from 'bluebird';
import log from 'loglevel';
import storage from '../utils/storage';
import { postRequest, getRequest } from '../utils/request';
import { LOGIN_URL, DEFAULT_MESSAGES_HOST } from '../constants';
import { getRegistrationTokenParams } from './registrationToken';
import subscribeToResources from '../resource/subscribe';
import { getTimezone, getCurrentTime } from '../utils/helpers';


export async function login(username, password) {
  try {
    const { skypeToken, expiryDate } =
      await sendLoginRequest(username, password);
    const { registrationTokenParams, messagesHost } =
      await getRegistrationTokenParams(skypeToken, DEFAULT_MESSAGES_HOST);

    storage.setItem('username', username);
    storage.setItem('skypeToken', skypeToken);
    storage.setItem('stExpiryDate', expiryDate);
    storage.setItem('registrationTokenParams', registrationTokenParams);
    storage.setItem('messagesHost', messagesHost);

    await subscribeToResources(registrationTokenParams, messagesHost);
    return;
  } catch (error) {
    throw error;
  }
}

async function sendLoginRequest(username, password) {
  try {
    const { pie, etm } = await getFormData();
    const timezone_field = getTimezone(); // eslint-disable-line camelcase
    const js_time = getCurrentTime(); // eslint-disable-line camelcase
    const postData = {
      url: LOGIN_URL,
      form: {
        username,
        password,
        pie,
        etm,
        timezone_field,
        js_time,
      },
    };
    return postLoginForm(postData);
  } catch (error) {
    throw error;
  }

  async function getFormData() {
    let [response, body] = await getRequest(LOGIN_URL); // eslint-disable-line prefer-const
    if (response.statusCode === 200) {
      const $ = cheerio.load(body);
      const pie = $('input[name="pie"]').val();
      const etm = $('input[name="etm"]').val();
      if (pie && etm) {
        return { pie, etm };
      }
      throw 'Failed to parse pie and etm from form';
    }
    throw 'Failed to get form data';
  }

  async function postLoginForm(postData) {
    let [response, body] = await postRequest(postData); // eslint-disable-line prefer-const
    if (response.statusCode === 200) {
      const $ = cheerio.load(body);
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
