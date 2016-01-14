import Deferred from 'es6-deferred';
import request from './request';
import { HTTPS, CONTACTS_HOST } from './constants';

export function getContacts(skypeToken, username) {
  const deferred = new Deferred();
  request(HTTPS + CONTACTS_HOST +
    '/contacts/v1/users/' + username + '/contacts',
    {
      headers: {
        'X-Skypetoken': skypeToken,
      },
    },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const contacts = JSON.parse(body).contacts;
        deferred.resolve(contacts);
      } else {
        deferred.reject('Failed to load contacts.');
      }
    });
  return deferred.promise;
}
