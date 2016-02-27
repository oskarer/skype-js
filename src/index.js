import storage from './utils/storage';
import { login } from './authentication/login';
import { getContacts } from './contacts';
import sendMessage from './message/sendMessage';
import poll from './resource/poll';
import events from './events';

const skype = {};

skype.login = login;
skype.events = events;

console.log(storage.getItem)

skype.contacts = async () => {
  const credentials = [
    storage.getItem('skypeToken'),
    storage.getItem('username'),
  ];

  return getContacts(...credentials);
};

skype.sendMessage = async (conversationId, message) => {
  const [regToken, messagesHost] = [
    storage.getItem('registrationTokenParams'),
    storage.getItem('messagesHost'),
  ];
  return sendMessage(conversationId, message, regToken, messagesHost);
};

skype.poll = async () => {
  const credentials = [
    storage.getItem('skypeToken'),
    storage.getItem('registrationTokenParams'),
    storage.getItem('messagesHost'),
    storage.getItem('username'),
  ];
  return poll(...credentials);
};

skype.isLoggedIn = () => {
  const stExpiryDate = storage.getItem('stExpiryDate');
  const expires = new Date(stExpiryDate);
  return expires > new Date();
};

export default skype;
