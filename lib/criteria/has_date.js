var util = require('util'),
  moment = require('moment'),
  BaseCriteria = require('./base.js'),
  date_parser = require('../mixins/date_parser.js'),
  relative_dates = require('../mixins/relative_dates.js');

var HasDateCriteria = function() {
  BaseCriteria.call(this);
  this.mixin(date_parser);
  this.mixin(relative_dates);
};
util.inherits(HasDateCriteria, BaseCriteria);
module.exports = HasDateCriteria;

HasDateCriteria.prototype.applies = function(params) {
  return params.hasOwnProperty('has_date');
};

HasDateCriteria.prototype.hasDate = function(item) {
  var parsed;

  // if this is a string, just test against it
  if (typeof item === 'string' || item instanceof String) {
    parsed = this.parseDate(item);
  }

  if (parsed) {
    return parsed;
  }

  return false;
};

HasDateCriteria.prototype.matches = function(item, params) {
  var result = this.hasDate(item);
  if ((result && params.has_date) || (!result && !params.has_date)) {
    return 1;
  }
  return 0;
};

HasDateCriteria.prototype.option = function(program) {
  program.option('--has-date', 'Select items that have a parseable date');
  return 'hasDate';
};
