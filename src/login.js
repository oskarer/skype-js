import Deferred from 'es6-deferred';
import log from 'loglevel';
import request from 'request';
import cheerio from 'cheerio';
import { SKYPEWEB_LOGIN_URL } from './constants';
import { getTimezone, getCurrentTime } from './utils';


export function login(username, password) {
  log.info(username, password);
  log.info(SKYPEWEB_LOGIN_URL);
  return sendLoginRequest(username, password);
}

function sendLoginRequest(username, password) {
  return getFormData()
  .then((formData) => {
    const { pie, etm } = formData;
    const timezone_field = getTimezone(); // eslint-disable-line camelcase
    const js_time = getCurrentTime(); // eslint-disable-line camelcase
    const postData = {
      url: SKYPEWEB_LOGIN_URL,
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
    request(SKYPEWEB_LOGIN_URL, (error, response, body) => {
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
        const skypeTokenExpiresIn = parseInt($('input[name="expires_in"]').val(), 10);
        if (skypeToken && skypeTokenExpiresIn) {
          deferred.resolve({ skypeToken, skypeTokenExpiresIn });
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
