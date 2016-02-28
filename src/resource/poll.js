import _ from 'lodash';
import request from '../utils/request';
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
      const headers = {
        RegistrationToken: registrationTokenParams.raw,
      };
      const response = await request
        .post(HTTPS + messagesHost + POLL_ENDPOINT)
        .set(headers)
        .end();
      if (response.statusCode !== 200) {
        throw 'Connection failed, code ' + response.statusCode;
      }
      if (response.body.eventMessages) {
        parseMessages(response.body.eventMessages);
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
