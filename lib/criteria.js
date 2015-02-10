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

var HasDateMixin = function() {};
HasDateMixin.hasDate = function(item) {
  var parsed;

  // if this is a string, just test against it
  if (typeof item === 'string' || item instanceof String) {
    parsed = HasDateMixin.parseDate(item);
  }

  if (parsed) {
    return parsed;
  }

  return false;
};

/**
 * Try to parse a date out of item.
 */
HasDateMixin.parseDate = function(item) {
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
criteria._mixins.HasDateMixin = HasDateMixin;

/**
 * BeforeCriteria
 *
 * Tests if the item is from before a given date.
 */
var BeforeCriteria = function() {
  BaseCriteria.call(this);
  this.mixin(HasDateMixin);
};
util.inherits(BeforeCriteria, BaseCriteria);
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
