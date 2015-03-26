var util = require('util'),
  moment = require('moment'),
  HasDateCriteria = require('./has_date.js');

/**
 * ExceptHourCriteria
 *
 * Tests if the item is not from the specified hour.
 */
var ExceptHourCriteria = function() {
  HasDateCriteria.call(this);
};
util.inherits(ExceptHourCriteria, HasDateCriteria);
module.exports = ExceptHourCriteria;

ExceptHourCriteria.prototype.applies = function(params) {
  return params.hasOwnProperty('except_hour');
};
ExceptHourCriteria.prototype.matches = function(item, params) {
  if (!Array.isArray(params.except_hour)) {
    params.except_hour = [params.except_hour];
  }

  var parsed = this.hasDate(item);
  if (parsed) {
    // if the date is in the params, return 1
    if (params.except_hour.indexOf(parsed.date.hour()) < 0) {
      return 1;
    }
  }
  return 0;
};
ExceptHourCriteria.prototype.option = function(program) {
  program.option('--except-hour <hour>', 'Select items that do not occur in a given hour', parseInt);
};
