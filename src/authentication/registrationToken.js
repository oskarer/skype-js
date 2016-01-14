import Deferred from 'es6-deferred';
import url from 'url';
import request from '../request';
import {
  HTTPS,
  DEFAULT_MESSAGES_HOST,
  CLIENTINFO_NAME,
  CLIENTINFO_VERSION,
  LOCKANDKEY_APPID,
  LOCKANDKEY_SECRET } from '../constants';
import { getCurrentTime, getMac256Hash } from '../utils';

export function getRegistrationToken(
  skypeToken,
  deferred = new Deferred(),
  messagesHost = DEFAULT_MESSAGES_HOST) {

  const currentTime = getCurrentTime();
  const lockAndKeyResponse = getMac256Hash(
    currentTime,
    LOCKANDKEY_APPID,
    LOCKANDKEY_SECRET);
  const LockAndKey = 'appId=' + LOCKANDKEY_APPID +
    '; time=' + currentTime + '; lockAndKeyResponse=' + lockAndKeyResponse;
  const ClientInfo = 'os=Windows; osVer=10; proc=Win64; lcid=en-us; ' +
    'deviceType=1; country=n/a; clientName=' +
    CLIENTINFO_NAME + '; clientVer=' +
    CLIENTINFO_VERSION;
  const Authentication = 'skypetoken=' + skypeToken;

  request.post(HTTPS + messagesHost + '/v1/users/ME/endpoints', {
    headers: { LockAndKey, ClientInfo, Authentication },
    body: '{}',
  }, (error, response, body) => {
    if (!error && response.statusCode === 301) {
      // Another message host
      const locationHeader = response.headers.location;
      const location = url.parse(locationHeader);
      getRegistrationToken(skypeToken, deferred, location.host);

    } else if (!error && response.statusCode === 201) {

      const registrationTokenHeader = response.headers['set-registrationtoken'];
      const registrationTokenParams = parseHeader(registrationTokenHeader);
      if (registrationTokenParams.registrationToken &&
        registrationTokenParams.expires &&
        registrationTokenParams.endpointId) {
        registrationTokenParams.expires =
          parseInt(registrationTokenParams.expires, 10);
        deferred.resolve(registrationTokenParams, messagesHost);

      } else {
        deferred.reject('Failed to parse registrationToken,' +
          ' expires or endpointId.');
      }
    } else {
      deferred.reject('Failed to get registrationToken.' +
        error + JSON.stringify(response));
    }
  });

  function parseHeader(header) {
    return header
      .split(/\s*;\s*/).reduce((params, current) => {
        const _params = params;
        if (current.indexOf('registrationToken') === 0) {
          _params.registrationToken = current;
        } else {
          const index = current.indexOf('=');
          if (index > 0) {
            _params[current.substring(0, index)] = current.substring(index + 1);
          }
        }
        return params;
      }, {
        raw: header,
      });
  }

  return deferred.promise;
}
