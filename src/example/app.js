import Promise from 'bluebird';
import log from 'loglevel';
import prompt from 'prompt';
import skype from '../..';

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

const promptGet = Promise.promisify(prompt.get);

if (!skype.isLoggedIn()) {
  promptGet(schema)
  .then((result) => { return skype.login(result.username, result.password); })
  .then((result) => {
    log.info(result);
    client();
  })
  .catch((error) => { log.error(error); });

} else {
  client();
}

function client() {
  console.log('\n\n#### skype-node ####\n' +
    '/contacts to get contacts\n' +
    '/messages to get messages\n' +
    '/exit to exit');
  prompt.get('command', (error, result) => {
    if (result.command === '/contacts') {
      skype.contacts()
      .then((contacts) => { console.log(contacts); })
      .catch((error) => { console.log(error); })
      .finally(() => { client(); });

    } else if (result.command === '/messages') {
      skype.messages()
      .then((messages) => { console.log(messages); })
      .catch((error) => { console.log(error); })
      .finally(() => { client(); });

    } else if (error || result.command === '/exit') {
      process.exit();
    }
  });
}
