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
  // return poll();
  async function poll() {
    try {
      let [response, body] = // eslint-disable-line
        await postRequest(HTTPS + messagesHost + POLL_ENDPOINT, {
          headers: {
            RegistrationToken: registrationTokenParams.raw,
          },
        });
      if (response.statusCode === 200) {
        const result = JSON.parse(body);
        if (result.eventMessages) {
          parseMessages(result.eventMessages);
        }
      } else {
        throw 'Connection failed, code: ' + response.statusCode;
      }
    } catch (error) {
      events.emit('error', 'Polling error: ' + error);
    }
  }

  function parseMessages(eventMessages) {
    const messages = eventMessages.filter((item) => {
      return item.resourceType === 'NewMessage' &&
        (item.resource.messagetype === 'RichText' ||
        item.resource.messagetype === 'Text');
    });
    if (messages.length > 0) {
      // log.info(messages.length + ' new messages!');
      const filteredMessages = _(messages).map((message) => {
        return {
          id: message.resource.id,
          received: message.time,
          content: message.resource.content,
          from: message.resource.imdisplayname,
          conversation: _.last(message.resource.conversationLink.split('/')),
        };
      }).value();
      _.each(filteredMessages, (message) => {
        events.emit('textMessage', message);
      });
    }
  }

}
