import log from 'loglevel';
import { login } from '..';

log.setLevel('info');

login('hello', 'hi')
.then((result) => { log.info(result); });
