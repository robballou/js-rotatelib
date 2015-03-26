var util = require('util'),
  moment = require('moment'),
  HasDateCriteria = require('./has_date.js');

/**
 * AfterCriteria
 *
 * Tests if the item is from After a given date.
 */
var AfterCriteria = function() {
  HasDateCriteria.call(this);
};
util.inherits(AfterCriteria, HasDateCriteria);
module.exports = AfterCriteria;

AfterCriteria.prototype.applies = function(params) {
  return params.hasOwnProperty('after');
};
AfterCriteria.prototype.matches = function(item, params) {
  var parsed = this.hasDate(item);
  if (parsed) {
    var then = this.parseRelativeDate(params.after);
    if (then && then.isValid() && parsed.date > then) {
      return 1;
    }
  }
  return 0;
};
AfterCriteria.prototype.option = function(program) {
  program.option('--after <date>', 'Select items after the given date');
};
