var requireDir = require('require-dir'),
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
criteria.hour = new criteriaItems.hour();
criteria.is_archive = new criteriaItems.is_archive();
criteria.except_hour = new criteriaItems.except_hour();
criteria.startswith = new criteriaItems.startswith();
criteria.except_startswith = new criteriaItems.except_startswith();
criteria.year = new criteriaItems.year();
criteria.except_year = new criteriaItems.except_year();
criteria.pattern = new criteriaItems.pattern();

module.exports = criteria;
