// import { EventEmitter } from 'events';
// let emitter = new EventEmitter();
// console.log(EventEmitter);
// console.log(emitter);
// export default emitter;

const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

export default myEmitter;
