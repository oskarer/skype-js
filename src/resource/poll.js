import log from 'loglevel';
import _ from 'lodash';
import { postRequest } from '../utils/request';
import { HTTPS, POLL_ENDPOINT } from '../constants';
import events from '../events';

export default function (
    skypeToken,
    registrationTokenParams,
    messagesHost,
    username) {
  setInterval(poll, 2000);

  async function poll() {
    let [response, body] = // eslint-disable-line
      await postRequest(HTTPS + messagesHost + POLL_ENDPOINT, {
        headers: {
          RegistrationToken: registrationTokenParams.raw,
        },
      });
    console.log(response.statusCode);
    if (response.statusCode === 200) {
      parseMessages(JSON.parse(body));
    }
  }

  function parseMessages(pollResult) {
    const messages = pollResult.eventMessages.filter((item) => {
      return item.resourceType === 'NewMessage';
    });
    if (messages.length > 0) {
      log.info(messages.length + ' new messages!');
      const filtered = _(messages).map((message) => {
        log.debug(message);
        return {
          id: message.resource.id,
          received: message.time,
          content: message.resource.content,
          from: message.resource.imdisplayname,
          conversation: message.resource.conversationLink.split('/').last(),
        };
      });
      events.emit('NewMessage', filtered.value());
    }
  }

}
