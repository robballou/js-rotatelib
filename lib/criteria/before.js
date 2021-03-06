var util = require('util'),
  moment = require('moment'),
  HasDateCriteria = require('./has_date.js');

/**
 * BeforeCriteria
 *
 * Tests if the item is from before a given date.
 */
var BeforeCriteria = function() {
  HasDateCriteria.call(this);
};
util.inherits(BeforeCriteria, HasDateCriteria);
module.exports = BeforeCriteria;

BeforeCriteria.prototype.applies = function(params) {
  return params.hasOwnProperty('before');
};
BeforeCriteria.prototype.matches = function(item, params) {
  var parsed = this.hasDate(item);
  if (parsed) {
    var then = this.parseRelativeDate(params.before);
    if (then && then.isValid() && parsed.date < then) {
      return 1;
    }
  }
  return 0;
};
BeforeCriteria.prototype.option = function(program) {
  program.option('--before <date>', 'Select items before the given date');
  return 'before';
};
