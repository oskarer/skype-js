import Deferred from 'es6-deferred';
import log from 'loglevel';

import request from '../utils/request';
import {
  HTTPS,
  SUBSCRIPTION_ENDPOINT,
} from '../constants';

export function subscribeToResources(
  registrationTokenParams,
  messagesHost) {

  const deferred = new Deferred();
  const interestedResources = [
    '/v1/threads/ALL',
    '/v1/users/ME/contacts/ALL',
    '/v1/users/ME/conversations/ALL/messages',
    '/v1/users/ME/conversations/ALL/properties',
  ];
  const body = JSON.stringify({
    interestedResources,
    template: 'raw',
    channelType: 'httpLongPoll',
  });
  const headers = {
    RegistrationToken: registrationTokenParams.raw,
  };
  request.post(HTTPS + messagesHost + SUBSCRIPTION_ENDPOINT, {
    body,
    headers,
  }, (error, response, body) => {
    if (!error && response.statusCode === 201) {
      deferred.resolve();
    } else {
      deferred.reject('FAIL', error);
    }
  });
  return deferred.promise;
}
