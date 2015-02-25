var util = require('util'),
  path = require('path'),
  BaseCriteria = require('./base.js');

/**
 * IsArchiveCriteria
 *
 * Tests if the item is not from the specified hour.
 */
var IsArchiveCriteria = function() {
};
util.inherits(IsArchiveCriteria, BaseCriteria);
module.exports = IsArchiveCriteria;

IsArchiveCriteria.prototype.applies = function(params) {
  return params.hasOwnProperty('is_archive');
};
IsArchiveCriteria.prototype.matches = function(item, params) {
  if (params.is_archive) {
    var archives = [
        '.gz',
        '.bz2',
        '.tgz',
        '.tbz2',
        '.zip'
      ];
    if (archives.indexOf(path.extname(item)) >= 0) {
      return 1;
    }
  }

  return 0;
};
