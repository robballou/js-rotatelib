// var events = require('events'),
//     util = require('util');
import { EventEmitter } from 'events';

export class BaseHandler extends EventEmitter {
    constructor() {
        super();
        this.rotatelib = null;
    }

    applies() {
        return true;
    }

    removeItem() {
        this.emit('removedItem');
    }

    test(params) {
        return 'test' in params && params.test;
    }
}
