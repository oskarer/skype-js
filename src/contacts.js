import log from 'loglevel';
import { getRequest } from './utils/request';
import { HTTPS, CONTACTS_HOST } from './constants';

export async function getContacts(skypeToken, username) {
  log.debug('Fetching contacts for', username);
  const [response, body] =
    await getRequest(HTTPS + CONTACTS_HOST +
      '/contacts/v1/users/' + username + '/contacts', {
        headers: {
          'X-Skypetoken': skypeToken,
        },
      });
  if (response.statusCode !== 200) {
    throw 'Request failed, code: ' + response.statusCode;
  } else {
    return JSON.parse(body).contacts;
  }
}
