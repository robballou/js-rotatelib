var events = require('events'),
  util = require('util');

var BaseHandler = function() {
  this.rotatelib = null;
};
util.inherits(BaseHandler, events.EventEmitter);

module.exports = BaseHandler;
BaseHandler.prototype.applies = function(params) {
  return true;
};

BaseHandler.prototype.removeItem = function(item, params) {
  this.emit('removedItem');
};

BaseHandler.prototype.test = function(params) {
  return params.hasOwnProperty('test') && params.test;
};
