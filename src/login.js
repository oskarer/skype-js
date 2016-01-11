import Deferred from 'es6-deferred';
import log from 'loglevel';

function sendLoginRequest(username, password) {
  const deferred = new Deferred();
  setTimeout(deferred.resolve('Logged in'), 3000);
  return deferred.promise;
}

export function login(username, password) {
  log.info(username, password);
  return sendLoginRequest(username, password);
}
