import log from 'loglevel';
import minimist from 'minimist';
import { login, getContacts, getRegistrationToken } from '..';

const argv = minimist(process.argv.slice(2));

const { username, password } = argv;
let { skypeToken } = argv;

log.setLevel('debug');

if (!skypeToken) {
  login(username, password)
  .then((result) => {
    log.info('Logged in', result);
    skypeToken = result.skypeToken;
    loadContacts(skypeToken, username);
    loadRegistrationToken(skypeToken);
  })
  .catch((error) => { log.error(error); });
} else {
  loadContacts(skypeToken, username);
  loadRegistrationToken(skypeToken);
}

function loadRegistrationToken(skypeToken) {
  getRegistrationToken(skypeToken)
  .then((registrationToken) => {
    log.info('Registration token expires', registrationToken.expires);
  })
  .catch((error) => { log.error(error); });
}

function loadContacts(skypeToken, username) {
  getContacts(skypeToken, username)
  .then((contacts) => {
    log.info('Contacts: ', contacts.length);
  })
  .catch((error) => { log.error(error); });
}
