import { postRequest } from '../utils/request';
import { HTTPS } from '../constants';

export default async function(conversationId, message, registrationTokenParams,
  messagesHost) {
  const body = JSON.stringify({
    content: message,
    messagetype: 'RichText',
    contenttype: 'text',
  });
  return postRequest(HTTPS + messagesHost + '/v1/users/ME/conversations/' +
    conversationId + '/messages', {
      body,
      headers: {
        RegistrationToken: registrationTokenParams.raw,
      },
    });
}
