var util = require('util'),
  moment = require('moment');
var criteria = {
  _mixins: {}
};

/**
 * BaseCriteria
 *
 * Parent of all the criteria
 */
var BaseCriteria = function() {};
BaseCriteria.prototype.applies = function(params) {
  return true;
};
BaseCriteria.prototype.matches = function(item, params) {
  return 1;
};
BaseCriteria.prototype.mixin = function(object) {
  for (var property in object) {
    if (object.hasOwnProperty(property)) {
      this[property] = object[property];
    }
  }
};
criteria.default = new BaseCriteria();

var HasDateCriteria = function() {
  this.patterns = [
    // YYYYMMDD, YYYY-MM-DD
    {
      pattern: /^.*(\d{4})-?(\d{2})-?(\d{2}).*$/,
      matches: {
        year: 1,
        month: 2,
        day: 3
      }
    },

    // YYYYMMDDHHMMSS, YYYYMMDDTHHMMSS
    {
      pattern: /^.*(\d{4})(\d{2})(\d{2})T?(\d{2})(\d{2})(\d{2}).*$/,
      matches: {
        year: 1,
        month: 2,
        day: 3,
        hour: 4,
        minute: 5,
        second: 6
      }
    },

    // YYYYMMDDHHMM, YYYYMMDDTHHMM
    {
      pattern: /^.*(\d{4})-?(\d{2})-?(\d{2})T?(\d{2}):?(\d{2}).*$/,
      matches: {
        year: 1,
        month: 2,
        day: 3,
        hour: 4,
        minute: 5
      }
    },

    // YYYYMMDDHHMM, YYYYMMDDTHHMM
    {
      pattern: /^.*(\d{4})-?(\d{2})-?(\d{2})T?(\d{2})-(\d+).*$/,
      matches: {
        year: 1,
        month: 2,
        day: 3,
        hour: 4
      }
    },
  ];
};
util.inherits(HasDateCriteria, BaseCriteria);

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
  if (result) {
    return 1;
  }
  return 0;
};

/**
 * Try to parse a date out of item.
 */
HasDateCriteria.prototype.parseDate = function(item) {
  var result = null;
  for (var i=0, c=this.patterns.length; i<c; i++) {
    var thisPattern = this.patterns[i],
      results = thisPattern.pattern.exec(item);
    if (results) {
      var date = this.regexResultToString(results, thisPattern);
      result = {'item': item, 'date': date};
    }
  }

  if (result) {
    return result;
  }

  return false;
};

/**
 * Convert the date
 */
HasDateCriteria.prototype.regexResultToString = function(results, pattern) {
  var date = moment();

  if (pattern.matches.hasOwnProperty('year')) {
    date.year(this.stripZeroLead(results[pattern.matches.year]));
  }

  if (pattern.matches.hasOwnProperty('month')) {
    month = parseInt(this.stripZeroLead(results[pattern.matches.month]), 10) - 1;
    date.month(month);
  }

  if (pattern.matches.hasOwnProperty('day')) {
    date.date(this.stripZeroLead(results[pattern.matches.day]));
  }

  if (pattern.matches.hasOwnProperty('hour')) {
    date.hour(this.stripZeroLead(results[pattern.matches.hour]));
  }
  else {
    date.hour(0);
  }

  if (pattern.matches.hasOwnProperty('minute')) {
    date.minute(this.stripZeroLead(results[pattern.matches.minute]));
  }
  else {
    date.minute(0);
  }

  if (pattern.matches.hasOwnProperty('second')) {
    date.second(this.stripZeroLead(results[pattern.matches.second]));
  }
  else {
    date.second(0);
  }

  return date;
};

HasDateCriteria.prototype.stripZeroLead = function(str) {
  if (str[0] === '0') {
    return str.substr(1);
  }
  return str;
};

criteria.has_date = new HasDateCriteria();

/**
 * BeforeCriteria
 *
 * Tests if the item is from before a given date.
 */
var BeforeCriteria = function() {
  HasDateCriteria.call(this);
};
util.inherits(BeforeCriteria, HasDateCriteria);
BeforeCriteria.prototype.applies = function(params) {
  return params.hasOwnProperty('before');
};
BeforeCriteria.prototype.matches = function(item, params) {
  if (this.hasDate(item)) {
    return 1;
  }
  return 0;
};
criteria.before = new BeforeCriteria();

module.exports = criteria;
