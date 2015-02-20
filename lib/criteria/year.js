var util = require('util'),
  moment = require('moment'),
  HasDateCriteria = require('./has_date.js');

/**
 * YearCriteria
 *
 * Tests if the item is not from the specified hour.
 */
var YearCriteria = function() {
  HasDateCriteria.call(this);
};
util.inherits(YearCriteria, HasDateCriteria);
module.exports = YearCriteria;

YearCriteria.prototype.applies = function(params) {
  return params.hasOwnProperty('year');
};
YearCriteria.prototype.matches = function(item, params) {
  if (!Array.isArray(params.year)) {
    params.year = [params.year];
  }

  var parsed = this.hasDate(item);
  if (parsed) {
    // if the date is in the params, return 1
    if (params.year.indexOf(parsed.date.year()) >= 0) {
      return 1;
    }
  }
  return 0;
};
