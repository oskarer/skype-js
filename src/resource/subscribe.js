import request from '../utils/request';
import {
  HTTPS,
  SUBSCRIPTION_ENDPOINT,
} from '../constants';

export default async function subscribe(
  registrationTokenParams,
  messagesHost) {

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
  const response = await request
    .post(HTTPS + messagesHost + SUBSCRIPTION_ENDPOINT)
    .set(headers)
    .send(body)
    .end();
  if (response.statusCode !== 201) {
    throw 'Failed to subscribe to resources, code ' + response.statusCode;
  }
}
