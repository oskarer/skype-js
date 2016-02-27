import Promise from 'bluebird';
import storage from './utils/storage';

import { login } from './authentication/login';
import { getContacts } from './contacts';
import { getMessages } from './messages';
import events from './events';

const skype = {};

skype.login = login;
skype.events = events;

const getItem = Promise.promisify(storage.getItem);

skype.contacts = async () => {
  const credentials = await Promise.all([
    getItem('skypeToken'),
    getItem('username'),
  ]);

  return getContacts(...credentials);
};

skype.messages = async () => {
  const credentials = await Promise.all([
    getItem('skypeToken'),
    getItem('registrationTokenParams'),
    getItem('messagesHost'),
    getItem('username'),
  ]);
  return getMessages(...credentials);
};

skype.isLoggedIn = () => {
  const stExpiryDate = storage.getItemSync('stExpiryDate');
  const expires = new Date(stExpiryDate);
  return expires > new Date();
};

export default skype;
