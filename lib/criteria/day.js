var util = require('util'),
  moment = require('moment'),
  HasDateCriteria = require('./has_date.js');

/**
 * DayCriteria
 *
 * Tests if the item is from before a given date.
 */
var DayCriteria = function() {
  HasDateCriteria.call(this);
};
util.inherits(DayCriteria, HasDateCriteria);
module.exports = DayCriteria;

DayCriteria.prototype.applies = function(params) {
  return params.hasOwnProperty('day');
};
DayCriteria.prototype.matches = function(item, params) {
  if (!Array.isArray(params.day)) {
    params.day = [params.day];
  }

  var parsed = this.hasDate(item);
  if (parsed) {
    // if the date is in the params, return 1
    if (params.day.indexOf(parsed.date.date()) >= 0) {
      return 1;
    }
  }
  return 0;
};
DayCriteria.prototype.option = function(program) {
  program.option('--day <day>', 'Select items that occur on a day of the month', parseInt);
};
