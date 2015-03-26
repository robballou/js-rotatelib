var util = require('util');

/**
 * PatternCriteria
 *
 * Tests if the item matches the pattern.
 */
var PatternCriteria = function() {
};
module.exports = PatternCriteria;

PatternCriteria.prototype.applies = function(params) {
  return params.hasOwnProperty('pattern');
};
PatternCriteria.prototype.matches = function(item, params) {
  if (!Array.isArray(params.pattern)) {
    params.pattern = [params.pattern];
  }

  for (var i=0, c=params.pattern.length; i < c; i++) {
    if (params.pattern[i].test(item)) {
      return 1;
    }
  }
  return 0;
};
PatternCriteria.prototype.option = function(program) {
  program.option('--pattern <pattern>', 'Select items that match a pttern');
};
