var util = require('util');

/**
 * StartswithCriteria
 *
 * Tests if the item is not from the specified hour.
 */
var StartswithCriteria = function() {
};
module.exports = StartswithCriteria;

StartswithCriteria.prototype.applies = function(params) {
  return params.hasOwnProperty('startswith');
};
StartswithCriteria.prototype.matches = function(item, params) {
  if (!Array.isArray(params.startswith)) {
    params.startswith = [params.startswith];
  }

  for (var i=0, c=params.startswith.length; i < c; i++) {
    if (item.substr(0, params.startswith[i].length) === params.startswith[i]) {
      return 1;
    }
  }
  return 0;
};
