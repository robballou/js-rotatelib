var util = require('util'),
  path = require('path'),
  BaseCriteria = require('./base.js');

/**
 * IsArchiveCriteria
 *
 * Tests if the item is an archived file.
 */
var IsArchiveCriteria = function() {
};
util.inherits(IsArchiveCriteria, BaseCriteria);
module.exports = IsArchiveCriteria;

IsArchiveCriteria.prototype.applies = function(params) {
  return params.hasOwnProperty('is_archive');
};
IsArchiveCriteria.prototype.matches = function(item, params) {
  var archives = [
    '.gz',
    '.bz2',
    '.tgz',
    '.tbz2',
    '.zip'
  ];
  if (archives.indexOf(path.extname(item)) >= 0) {
    if (params.is_archive) {
      return 1;
    }
    return 0;
  }

  if (params.is_archive) {
    return 0;
  }
  return 1;
};
IsArchiveCriteria.prototype.option = function(program) {
  program.option('--is-archive <archive>', 'The item is an archive or not (true|false)', function(input) {
    if (input == 'true') {
      return true;
    }
    return false;
  });
  return 'isArchive';
};
