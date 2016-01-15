import log from 'loglevel';
import Promise from 'bluebird';
import prompt from 'prompt';
import { start, login, getContacts, getRegistrationToken } from '../..';

log.setLevel('debug');

const schema = {
  properties: {
    username: {
      required: true,
    },
    password: {
      hidden: true,
    },
  },
};

prompt.start();

start()
.then((result) => {
  log.info('logged in', result);
  client();
})
.catch((error) => {
  log.error(error);
  prompt.get(schema, (error, result) => {
    if (result) {
      start(result.username, result.password);
    }
  });
});


function client() {
  console.log('Simple skype-node client\n' +
    '/help to print this info\n' +
    '/contacts to get contacts\n');
  prompt.get('command', (error, result) => {
    if (result.command === '/contacts') {
      console.log('getting contacts');
      getContacts().then((contacts) => {
        console.log('Num contacts: ', contacts.length);
        client();
      });
    }
  });
}


// if (!skypeToken) {
//   login(username, password)
//   .then((result) => {
//     log.info('Logged in', result);
//     skypeToken = result.skypeToken;
//     getBaseData(skypeToken, username);
//   })
//   .catch((error) => { log.error(error); });
// } else {
//   getBaseData(skypeToken, username);
// }
//
// function getBaseData(skypeToken, username) {
//   Promise.props({
//     contacts: getContacts(skypeToken, username),
//     registrationToken: getRegistrationToken(skypeToken),
//   })
//   .then((result) => {
//     log.info('Registration token expires', result.registrationToken.expires);
//     log.info('Contacts: ', result.contacts.length);
//   })
//   .catch((error) => { log.error(error); });
// }
