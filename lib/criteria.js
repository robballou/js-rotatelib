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
criteria.has_date = new criteriaItems.has_date();

module.exports = criteria;
