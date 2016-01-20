require('babel-polyfill');
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

async function client() {
  console.log('\n\n#### skype-node ####\n' +
  '/contacts to get contacts\n' +
  '/messages to get messages\n' +
  '/exit to exit');
  const prompt = await promptGet('command');

  if (prompt.command === '/contacts') {
    try {
      console.log(await skype.contacts());
    } catch (error) {
      log.error('Failed to get contacts: ' + error);
    }
    client();
  } else if (prompt.command === '/messages') {
    try {
      console.log(await skype.messages());
    } catch (error) {
      log.error('Failed to get messages: ' + error);
    }
    client();
  } else if (prompt.command === '/exit') {
    process.exit();
  } else {
    log.warning('Unknown command');
    client();
  }
}

async function start() {
  if (!skype.isLoggedIn()) {
    try {
      const prompt = await promptGet(schema);
      await skype.login(prompt.username, prompt.password);
      log.info('Login successful');
    } catch (error) {
      log.error('Login failed: ' + error);
    }
  }
  client();
}

start();
