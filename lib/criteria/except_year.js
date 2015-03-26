var util = require('util'),
  moment = require('moment'),
  HasDateCriteria = require('./has_date.js');

/**
 * ExceptYearCriteria
 *
 * Tests if the item is not from the specified hour.
 */
var ExceptYearCriteria = function() {
  HasDateCriteria.call(this);
};
util.inherits(ExceptYearCriteria, HasDateCriteria);
module.exports = ExceptYearCriteria;

ExceptYearCriteria.prototype.applies = function(params) {
  return params.hasOwnProperty('except_year');
};
ExceptYearCriteria.prototype.matches = function(item, params) {
  if (!Array.isArray(params.except_year)) {
    params.except_year = [params.except_year];
  }

  var parsed = this.hasDate(item);
  if (parsed) {
    // if the date is in the params, return 1
    if (params.except_year.indexOf(parsed.date.year()) < 0) {
      return 1;
    }
  }
  return 0;
};
ExceptYearCriteria.prototype.option = function(program) {
  program.option('--except-year <year>', 'Select items that do not start with this string', parseInt);
  return 'exceptYear';
};
