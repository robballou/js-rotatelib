var criteria = {};

var BaseCriteria = function() {};
BaseCriteria.prototype.matches = function(item, params) {
  return true;
};

criteria['default'] = new BaseCriteria();

module.exports = criteria;
