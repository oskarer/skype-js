import Deferred from 'es6-deferred';
import log from 'loglevel';
import Promise from 'bluebird';
import storage from './utils/storage';

import { login } from './authentication/login';
import { getContacts } from './contacts';
import { getMessages } from './messages';

export { getRegistrationToken } from './authentication/registrationToken';

const skype = {};

skype.login = login;

skype.contacts = () => {
  const getItem = Promise.promisify(storage.getItem);
  return Promise.all([
    getItem('skypeToken'),
    getItem('username'),
  ])
  .then((result) => getContacts(...result));
};

skype.messages = () => {
  const getItem = Promise.promisify(storage.getItem);
  return Promise.all([
    getItem('skypeToken'),
    getItem('registrationTokenParams'),
    getItem('messagesHost'),
    getItem('username'),
  ])
  .then((result) => getMessages(...result));
};

skype.isLoggedIn = () => {
  const stExpiryDate = storage.getItemSync('stExpiryDate');
  const expires = new Date(stExpiryDate);
  if (expires > new Date()) {
    return true;
  }
  return false;
};

export default skype;
