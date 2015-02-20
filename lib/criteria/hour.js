var util = require('util'),
  moment = require('moment'),
  HasDateCriteria = require('./has_date.js');

/**
 * HourCriteria
 *
 * Tests if the item is from the given hour.
 */
var HourCriteria = function() {
  HasDateCriteria.call(this);
};
util.inherits(HourCriteria, HasDateCriteria);
module.exports = HourCriteria;

HourCriteria.prototype.applies = function(params) {
  return params.hasOwnProperty('hour');
};
HourCriteria.prototype.matches = function(item, params) {
  if (!Array.isArray(params.hour)) {
    params.hour = [params.hour];
  }

  var parsed = this.hasDate(item);
  if (parsed) {
    // if the date is in the params, return 1
    if (params.hour.indexOf(parsed.date.hour()) >= 0) {
      return 1;
    }
  }
  return 0;
};
