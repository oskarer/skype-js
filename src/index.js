import Promise from 'bluebird';
import storage from './utils/storage';

import { login } from './authentication/login';
import { getContacts } from './contacts';
import sendMessage from './message/sendMessage';
import poll from './resource/poll';
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

skype.sendMessage = async (conversationId, message) => {
  const [regToken, messagesHost] = await Promise.all([
    getItem('registrationTokenParams'),
    getItem('messagesHost'),
  ]);
  return sendMessage(conversationId, message, regToken, messagesHost);
};

skype.poll = async () => {
  const credentials = await Promise.all([
    getItem('skypeToken'),
    getItem('registrationTokenParams'),
    getItem('messagesHost'),
    getItem('username'),
  ]);
  return poll(...credentials);
};

skype.isLoggedIn = () => {
  const stExpiryDate = storage.getItemSync('stExpiryDate');
  const expires = new Date(stExpiryDate);
  return expires > new Date();
};

export default skype;
