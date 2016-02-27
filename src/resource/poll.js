import log from 'loglevel';
import { postRequest } from '../utils/request';
import { HTTPS, POLL_ENDPOINT } from '../constants';
import events from '../events';

export function startPolling(
    skypeToken,
    registrationTokenParams,
    messagesHost,
    username) {
  console.log('startPolling');
  setInterval(poll, 2000);

  function poll() {
    console.log('I  poll');
    postRequest(HTTPS + messagesHost + POLL_ENDPOINT, {
      headers: {
        RegistrationToken: registrationTokenParams.raw,
      },
    }).then((error, response, body) => {
      console.log(error);
      if (!error && response.statusCode === 200) {
        parseMessages(JSON.parse(body));
      }
    });
  }

  function parseMessages(pollResult) {
    try {
      const messages = pollResult.eventMessages.filter((item) => {
        return item.resourceType === 'NewMessage';
      });
      console.log(messages);
      events.emit('NewMessage', messages);
    } catch (error) {
      log.error('Failed parsing messages: ' + error);
    }
  }

}
