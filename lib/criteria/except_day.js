var util = require('util'),
  moment = require('moment'),
  HasDateCriteria = require('./has_date.js');

/**
 * ExceptDayCriteria
 *
 * Tests if the item is from before a given date.
 */
var ExceptDayCriteria = function() {
  HasDateCriteria.call(this);
};
util.inherits(ExceptDayCriteria, HasDateCriteria);
module.exports = ExceptDayCriteria;

ExceptDayCriteria.prototype.applies = function(params) {
  return params.hasOwnProperty('except_day');
};
ExceptDayCriteria.prototype.matches = function(item, params) {
  if (!Array.isArray(params.except_day)) {
    params.except_day = [params.except_day];
  }

  var parsed = this.hasDate(item);
  if (parsed) {
    // if the date is in the params, return 1
    if (params.except_day.indexOf(parsed.date.date()) < 0) {
      return 1;
    }
  }
  return 0;
};
ExceptDayCriteria.prototype.option = function(program) {
  program.option('--except-day <day>', 'Select items that do not occur on a day of the month', parseInt);
};
