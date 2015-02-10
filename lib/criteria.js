var util = require('util'),
  moment = require('moment'),
  requireDir = require('require-dir'),
  criteriaItems = requireDir('./criteria');

var criteria = {
  _mixins: {}
};

criteria.default = new criteriaItems.base();
criteria.after = new criteriaItems.after();
criteria.before = new criteriaItems.before();
criteria.day = new criteriaItems.day();
criteria.except_day = new criteriaItems.except_day();
criteria.has_date = new criteriaItems.has_date();

module.exports = criteria;
