import log from 'loglevel';
import { HTTPS, CONTACTS_HOST } from './constants';
import request from './utils/request';

export async function getContacts(skypeToken, username) {
  log.debug('Fetching contacts for', username);
  const response = await request
    .get(HTTPS + CONTACTS_HOST + '/contacts/v1/users/' + username + '/contacts')
    .set('X-Skypetoken', skypeToken)
    .end();

  if (response.statusCode !== 200) {
    throw 'Request failed, code: ' + response.statusCode;
  } else {
    return response.body.contacts;
  }
}
