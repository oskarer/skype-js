import Deferred from 'es6-deferred';
import request from './utils/request';
import { HTTPS, POLL_ENDPOINT } from './constants';

export function getMessages(
    skypeToken,
    registrationTokenParams,
    messagesHost,
    username) {

  const deferred = new Deferred();

  // console.log(registrationTokenParams.raw);
  console.log(HTTPS + 'bay-' + messagesHost + POLL_ENDPOINT);
  console.log(registrationTokenParams.raw);
  const regtoken = 'registrationToken=U2lnbmF0dXJlOjI6Mjg6QVFRQUFBQVduTlVqTmtqcytVZS9JYVpXYnJsdjtWZXJzaW9uOjY6MToxO0lzc3VlVGltZTo0OjE5OjUyNDc1NzIzNjk1ODgwMzk3NjY7RXAuSWRUeXBlOjc6MToxO0VwLklkOjI6MjU6b3NrYXIuZXJpa3Nzb245QGdtYWlsLmNvbTtFcC5FcGlkOjU6MzY6ODZiYzVkNGEtNTNlYy00ZDZkLTg2MmYtNDMxYzNmMGFjYTBhO0VwLkxvZ2luVGltZTo3OjE6MDtFcC5BdXRoVGltZTo0OjE5OjUyNDc1NzIzNjk1ODc0MTQ3NjY7RXAuQXV0aFR5cGU6NzoyOjE1O1Vzci5OZXRNYXNrOjExOjE6MztVc3IuWGZyQ250OjY6MTowO1Vzci5SZHJjdEZsZzoyOjA6O1Vzci5FeHBJZDo5OjE6MDtVc3IuRXhwSWRMYXN0TG9nOjQ6MTowO1VzZXIuQXRoQ3R4dDoyOjI2MDpDbE5yZVhCbFZHOXJaVzRaYjNOcllYSXVaWEpwYTNOemIyNDVRR2R0WVdsc0xtTnZiUUVEVldsakZERXZNUzh3TURBeElERXlPakF3T2pBd0lFRk5ERTV2ZEZOd1pXTnBabWxsWk1ZYU1UTUJRS1FyQUFBQUFBQUFRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQXBoWTJoeWIyNXZjemt4QUFBQUFBQUFBQUFBQjA1dlUyTnZjbVVBQUFBQUJBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBRUtZV05vY205dWIzTTVNUVFBQUFBPTs=; expires=1453124716; endpointId={86bc5d4a-53ec-4d6d-862f-431c3f0aca0a}';
  console.log(request.jar().getCookies());
  request.post(HTTPS + 'bay-' + messagesHost + POLL_ENDPOINT, {
    headers: {
      RegistrationToken: regtoken,
    },
  }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      parseMessages(JSON.parse(body), deferred);
    } else {
      deferred.reject('Error getting messages; HTTP ' +
        response.statusCode + error);
    }
  });

  function parseMessages(pollResult, deferred) {
    if (pollResult.eventMessages) {
      const messages = pollResult.eventMessages.filter((item) => {
        return item.resourceType === 'NewMessage';
      });
      deferred.resolve(messages);
    } else {
      deferred.reject('Failed to parse messages');
    }
  }

  return deferred.promise;
}
