var util = require('util');

/**
 * ExceptStartswithCriteria
 *
 * Tests if the item is not from the specified hour.
 */
var ExceptStartswithCriteria = function() {
};
module.exports = ExceptStartswithCriteria;

ExceptStartswithCriteria.prototype.applies = function(params) {
  return params.hasOwnProperty('except_startswith');
};
ExceptStartswithCriteria.prototype.matches = function(item, params) {
  if (!Array.isArray(params.except_startswith)) {
    params.except_startswith = [params.except_startswith];
  }

  for (var i=0, c=params.except_startswith.length; i < c; i++) {
    if (item.substr(0, params.except_startswith[i].length) === params.except_startswith[i]) {
      return 0;
    }
  }
  return 1;
};
ExceptStartswithCriteria.prototype.option = function(program) {
  program.option('--except-startswith <string>', 'Select items that do not start with this string');
};
