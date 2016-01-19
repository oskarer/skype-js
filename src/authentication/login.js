import Deferred from 'es6-deferred';
import cheerio from 'cheerio';
import Promise from 'bluebird';
import log from 'loglevel';
import storage from '../utils/storage';
import request from '../utils/request';
import { LOGIN_URL, DEFAULT_MESSAGES_HOST } from '../constants';
import { getRegistrationTokenParams } from './registrationToken';
import { subscribeToResources } from './subscription';
import { getTimezone, getCurrentTime } from '../utils/helpers';


export function login(username, password) {
  const getItem = Promise.promisify(storage.getItem);

  return sendLoginRequest(username, password)
    .then((result) => {
      return Promise.all([
        storage.setItem('messagesHost', DEFAULT_MESSAGES_HOST),
        storage.setItem('username', username),
        storage.setItem('skypeToken', result.skypeToken),
        storage.setItem('stExpiryDate', result.expiryDate),
      ])
      .then(() => getRegistrationTokenParams(
        result.skypeToken,
        DEFAULT_MESSAGES_HOST));
    })
    .then((result) => {
      return Promise.all([
        storage.setItem('registrationTokenParams',
          result.registrationTokenParams),
        storage.setItem('messagesHost',
          result.messagesHost),
      ]);
    })
    .then(() => Promise.all([
      getItem('registrationTokenParams'),
      getItem('messagesHost'),
    ]))
    .then((result) => subscribeToResources(...result));
}

function sendLoginRequest(username, password) {
  return getFormData()
    .then((formData) => {
      const { pie, etm } = formData;
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
    });


  function getFormData() {
    const deferred = new Deferred();
    request(LOGIN_URL, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(body);
        const pie = $('input[name="pie"]').val();
        const etm = $('input[name="etm"]').val();
        if (pie && etm) {
          deferred.resolve({ pie, etm });
        } else {
          deferred.reject('Failed to parse pie and etm from form');
        }
      } else {
        deferred.reject('Failed to get form data');
      }
    });
    return deferred.promise;
  }

  function postLoginForm(postData) {
    const deferred = new Deferred();
    request.post(postData, (error, response, body) => {
      if (!error && response.statusCode === 200) {
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
          deferred.resolve({ skypeToken, expiryDate });
        } else {
          deferred.reject('Login failed, credentials are incorrect or you\'ve' +
            ' hit a CAPTCHA wall: ' + $('.message_error').text());
        }
      } else {
        deferred.reject('Login request failed');
      }
    });
    return deferred.promise;
  }
}
