var util = require('util'),
  fs = require('fs'),
  path = require('path'),
  BaseHandler = require('./base.js');

var FilesystemHandler = function() {
  BaseHandler.call(this);
};
util.inherits(FilesystemHandler, BaseHandler);

module.exports = FilesystemHandler;

FilesystemHandler.prototype.applies = function(params) {
  return params.hasOwnProperty('directory');
};

FilesystemHandler.prototype.list = function(params) {
  var self = this,
    directory = path.normalize(params.directory),
    applyCriteria = this.rotatelib.getApplicableCriteria(params);

  fs.readdir(directory, function(err, files) {
    var items = [];
    files.forEach(function(item) {
      if (self.rotatelib.matchesCriteria(item, params, applyCriteria)) {
        items.push(item);
      }
    });
    self.emit('done', items);
  });

  return this;
};

FilesystemHandler.prototype.removeItem = function(item, params) {
  item = path.normalize(path.join(params.directory, item));

  // simulate removing the item
  if (this.test(params)) {
    console.log('Remove: ' + item);
    this.emit('removedItem');
    return;
  }

  // actually remove the item
  this.emit('removedItem');
};
