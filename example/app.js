import log from 'loglevel';
import minimist from 'minimist';
import { login } from '..';

const argv = minimist(process.argv.slice(2));

log.setLevel('info');

login(argv._[0], argv._[1])
.then((result) => { log.info(result); })
.catch((error) => { log.error(error); });
