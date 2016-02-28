import Promise from 'bluebird';
import log from 'loglevel';
import prompt from 'prompt';
import skype from '../..';

log.setLevel('debug');

const loginSchema = {
  properties: {
    username: {
      required: true,
    },
    password: {
      required: true,
      hidden: true,
    },
  },
};

const sendSchema = {
  properties: {
    conversationId: {
      required: true,
    },
    message: {
      required: true,
    },
  },
};

prompt.start();

const promptGet = Promise.promisify(prompt.get);

let messages = [];

async function client() {
  console.log('\n\n#### skype-node ####\n' +
  '/contacts to get contacts\n' +
  '/messages to view received messages\n' +
  '/send to send message\n' +
  '/poll to start polling\n' +
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
    console.log(messages);
    client();
  } else if (prompt.command === '/send') {
    const sendPrompt = await promptGet(sendSchema);
    try {
      await skype.sendMessage(sendPrompt.conversationId, sendPrompt.message);
    } catch (error) {
      log.error('Failed to send: ', error);
    }
    client();
  } else if (prompt.command === '/poll') {
    skype.poll();
    console.log('Started polling');
    client();
  } else if (prompt.command === '/exit') {
    process.exit();
  } else {
    log.warn('Unknown command');
    client();
  }
}

async function start() {
  if (!skype.isLoggedIn()) {
    try {
      const prompt = await promptGet(loginSchema);
      await skype.login(prompt.username, prompt.password);
      log.info('Login successful');
      client();
    } catch (error) {
      log.error('Login failed: ' + error);
      start();
    }
  }
  client();
}

start();

skype.events.on('error', (error) => {
  console.log(error);
});

skype.events.on('textMessage', (message) => {
  messages = messages.concat(message);
});
