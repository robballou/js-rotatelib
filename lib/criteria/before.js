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
    var then = moment(params.before);
    if (parsed.date < then) {
      return 1;
    }
  }
  return 0;
};
