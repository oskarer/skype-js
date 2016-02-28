import request from '../utils/request';
import { HTTPS } from '../constants';

export default async function(conversationId, message, registrationTokenParams,
  messagesHost) {
  const body = {
    content: message,
    messagetype: 'RichText',
    contenttype: 'text',
  };
  const headers = {
    RegistrationToken: registrationTokenParams.raw,
  };
  return request
    .post(HTTPS + messagesHost + '/v1/users/ME/conversations/' +
      conversationId + '/messages')
    .set(headers)
    .send(body)
    .end();
}
