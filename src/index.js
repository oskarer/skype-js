import Deferred from 'es6-deferred';
import log from 'loglevel';
import storage from './utils/storage';
import { login } from './authentication/login';

export { getRegistrationToken } from './authentication/registrationToken';
export { getContacts } from './contacts';

export function start(username, password) {
  return isLoggedIn()
  .then((loggedIn) => {
    const deferred = new Deferred();
    if (loggedIn) {
      log.debug('Already logged in, using existing skypeToken');
      deferred.resolve('Logged in');
    } else if (!loggedIn && username && password) {
      // Login using credentials
      deferred.resolve(login(username, password));
    } else {
      deferred.reject('Not logged in, call start again with credentials.');
    }
    return deferred.promise;
  });
}

function isLoggedIn() {
  const deferred = new Deferred();
  // storage.setItemSync('skypeTokenExpiresIn',
  //   new Date(new Date().getTime() + 1000000));
  storage.getItem('stExpiryDate', (error, result) => {
    const expires = new Date(result);
    if (error) {
      deferred.reject('Failed to utilize storage.');
    } else if (!result || expires < new Date()) {
      deferred.resolve(false);
    } else {
      deferred.resolve(true);
    }
  });
  return deferred.promise;
}
