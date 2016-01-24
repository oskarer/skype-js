import log from 'loglevel';
import { postRequest } from './utils/request';
import { HTTPS, POLL_ENDPOINT } from './constants';

export async function getMessages(
    skypeToken,
    registrationTokenParams,
    messagesHost,
    username) {

  try {
    console.log(HTTPS + messagesHost + POLL_ENDPOINT, {
      headers: {
        RegistrationToken: registrationTokenParams.raw,
      },
    });
    const [response, body] =
      await postRequest(HTTPS + messagesHost + POLL_ENDPOINT, {
        headers: {
          RegistrationToken: registrationTokenParams.raw,
        },
      });
    if (response.statusCode !== 200) {
      throw response.statusCode;
    } else {
      return parseMessages(JSON.parse(body));
    }
  } catch (error) {
    return error;
  }

  function parseMessages(pollResult) {
    log.debug(pollResult);
    if (pollResult.eventMessages) {
      const messages = pollResult.eventMessages.filter((item) => {
        return item.resourceType === 'NewMessage';
      });
      return messages;
    } else {
      return 'Failed to parse messages';
    }
  }

}
