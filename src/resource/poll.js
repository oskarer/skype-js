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
      if (response.statusCode !== 200) {
        throw 'Connection failed, code ' + response.statusCode;
      }
      const parsedBody = JSON.parse(body);
      if (parsedBody.eventMessages) {
        parseMessages(parsedBody.eventMessages);
      }
    } catch (error) {
      events.emit('error', 'Polling failed: ' + error);
    }
  }

  function parseMessages(eventMessages) {
    const messages = _.chain(eventMessages)
      .filter((item) => {
        return item.resourceType === 'NewMessage' &&
          (item.resource.messagetype === 'RichText' ||
          item.resource.messagetype === 'Text');
      })
      .map((message) => {
        return {
          id: message.resource.id,
          received: message.time,
          content: message.resource.content,
          from: message.resource.imdisplayname,
          conversation: _.last(message.resource.conversationLink.split('/')),
        };
      })
      .value();
    _.each(messages, (message) => {
      events.emit('textMessage', message);
    });
  }

}
