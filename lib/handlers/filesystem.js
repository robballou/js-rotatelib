var util = require('util'),
  fs = require('fs'),
  path = require('path'),
  Q = require('q'),
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
    applyCriteria = this.rotatelib.getApplicableCriteria(params),
    applyFilters = this.rotatelib.getApplicableFilters(params),
    deferred = Q.defer();

  fs.readdir(directory, function(err, files) {
    var items = [];
    files.forEach(function(item) {
      if (self.rotatelib.matchesCriteria(item, params, applyCriteria)) {
        items.push(item);
      }
    });

    if (applyFilters) {
      applyFilters.forEach(function(filter) {
        items = filter.filter(items, params);
      });
    }

    deferred.resolve(items);
  });

  return deferred.promise;
};

/**
 * Remove the items.
 */
FilesystemHandler.prototype.removeItems = function(items, params) {
  var self = this,
    deferred = Q.defer();

  self.itemsToRemove = items.length;
  items.forEach(function(item) {
    self.removeItem(item, params)
      .then(function() {
        self.itemsToRemove--;
        console.log(self.itemsToRemove);
        if (self.itemsToRemove <= 0) {
          self.itemsToRemove = 0;
          return deferred.resolve(items);
        }
      });
  });

  return deferred.promise;
};

FilesystemHandler.prototype.removeItem = function(item, params) {
  var deferred = Q.defer(),
    itemPath = path.normalize(path.join(params.directory, item));

  // simulate removing the item
  if (this.test(params)) {
    console.log('Remove: ' + itemPath);
  }
  console.log('thing');
  deferred.resolve(item, itemPath);
  return deferred.promise;
};
