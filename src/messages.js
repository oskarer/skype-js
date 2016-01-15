import Deferred from 'es6-deferred';
import request from './utils/request';
import { HTTPS, CONTACTS_HOST } from './constants';

export function getMessages(skypeToken, registrationToken, username) {
  request.post(HTTPS + messagesHost + '/v1/users/ME/endpoints/SELF/subscriptions/0/poll', {
    headers: {
      RegistrationToken: skypeAccount.registrationTokenParams.raw
    }
  }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
          Poll.parsePollResult(JSON.parse(body), messagesCallback);
      }
      else {
          Utils.throwError('Failed to poll messages.');
      }
      _this.pollAll(skypeAccount, messagesCallback);
  });
}
