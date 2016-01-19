import Deferred from 'es6-deferred';
import log from 'loglevel';
import request from './utils/request';
import { HTTPS, POLL_ENDPOINT } from './constants';

export function getMessages(
    skypeToken,
    registrationTokenParams,
    messagesHost,
    username) {

  const deferred = new Deferred();

  request.post(HTTPS + messagesHost + POLL_ENDPOINT, {
    headers: {
      RegistrationToken: registrationTokenParams.raw,
    },
  }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      parseMessages(JSON.parse(body), deferred);
    } else {
      deferred.reject('Error getting messages; HTTP ' +
        response.statusCode + ' ' + response['body']); // eslint-disable-line
    }
  });

  function parseMessages(pollResult, deferred) {
    log.debug(pollResult);
    if (pollResult.eventMessages) {
      const messages = pollResult.eventMessages.filter((item) => {
        return item.resourceType === 'NewMessage';
      });
      deferred.resolve(messages);
    } else {
      deferred.reject('Failed to parse messages');
    }
  }

  return deferred.promise;
}
