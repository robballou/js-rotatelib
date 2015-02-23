var requireDir = require('require-dir'),
  filterItems = requireDir('./filters');

var filters = {
  _mixins: {}
};

filters.except_first = new filterItems.except_first();
filters.except_last = new filterItems.except_last();

module.exports = filters;
