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

var HasDateCriteria = function() {};
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
  var result = this.hasDate();
  if (result) {
    return 1;
  }
  return 0;
};

/**
 * Try to parse a date out of item.
 */
HasDateCriteria.prototype.parseDate = function(item) {
  // first try the whole thing
  var date = moment(item);
  if (date.isValid()) {
    return {
      'item': item,
      'date': date
    };
  }

  return false;
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
