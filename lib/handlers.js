var requireDir = require('require-dir'),
  handlerItems = requireDir('./handlers');

var handlers = {};

handlers.filesystem = new handlerItems.filesystem();

module.exports = handlers;
