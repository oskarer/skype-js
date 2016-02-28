import superAgentPromise from 'superagent-promise-plugin';
import superagent from 'superagent-use';

superagent.use(superAgentPromise);

export default superagent;
