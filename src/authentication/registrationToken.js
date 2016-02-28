import url from 'url';
import log from 'loglevel';
import request from '../utils/request';
import {
  HTTPS,
  CLIENTINFO_NAME,
  CLIENTINFO_VERSION,
  LOCKANDKEY_APPID,
  LOCKANDKEY_SECRET } from '../constants';
import { getCurrentTime, getMac256Hash } from '../utils/helpers';

export async function getRegistrationTokenParams(
  skypeToken,
  messagesHost) {

  const currentTime = getCurrentTime();
  const lockAndKeyResponse = getMac256Hash(
    currentTime,
    LOCKANDKEY_APPID,
    LOCKANDKEY_SECRET);
  const headers = constructHeaders();

  const response = await request
    .post(HTTPS + messagesHost + '/v1/users/ME/endpoints')
    .set(headers)
    .send('{}')
    .end();

  if (response.statusCode === 301) {
    // Another message host
    const locationHeader = response.headers.location;
    const location = url.parse(locationHeader);
    log.info('301 moved, redirecting: ', location.host);
    return getRegistrationTokenParams(skypeToken, location.host);

  } else if (response.statusCode === 201) {

    const registrationTokenHeader = response.headers['set-registrationtoken'];
    const registrationTokenParams = parseHeader(registrationTokenHeader);
    if (registrationTokenParams.registrationToken &&
      registrationTokenParams.expires &&
      registrationTokenParams.endpointId) {
      registrationTokenParams.expires =
        parseInt(registrationTokenParams.expires, 10);
      return { registrationTokenParams, messagesHost };

    }
    throw 'Failed to parse registrationToken, expires or endpointId.';
  } else {
    throw 'Failed to get registrationToken.';
  }

  function constructHeaders() {
    const LockAndKey = 'appId=' + LOCKANDKEY_APPID +
      '; time=' + currentTime + '; lockAndKeyResponse=' + lockAndKeyResponse;
    const ClientInfo = 'os=Windows; osVer=10; proc=Win64; lcid=en-us; ' +
      'deviceType=1; country=n/a; clientName=' +
      CLIENTINFO_NAME + '; clientVer=' +
      CLIENTINFO_VERSION;
    const Authentication = 'skypetoken=' + skypeToken;
    return { LockAndKey, ClientInfo, Authentication };
  }

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
}
