var date_parser = require('../mixins/date_parser.js');

/**
 * ExceptFirstFilter
 */
var ExceptFirstFilter = function() {
  this.mixin(date_parser);
};
module.exports = ExceptFirstFilter;
ExceptFirstFilter.prototype.applies = function(params) {
  return params.hasOwnProperty('except_first') && (params.except_first === 'day' || params.except_first === 'month');
};
ExceptFirstFilter.prototype.filter = function(items, params) {
  // matches will contain the things we need to return
  var matches = [],
    // buckets is used for storing/sorting things
    buckets = {},
    self = this;

  items.forEach(function(item) {
    var parsed = self.parseDate(item);
    if (parsed) {
      var thisDate = parsed.date.format('YYYYMM');
      if (params.except_first === 'day') {
        thisDate += parsed.date.format('DD');
      }

      if (!buckets.hasOwnProperty(thisDate)) {
        buckets[thisDate] = [];
      }

      buckets[thisDate].push(parsed);
    }
  });

  for (var bucketDate in buckets) {
    if (buckets[bucketDate].length === 1) {
      matches.push(buckets[bucketDate][0].item);
      continue;
    }

    // there is more than one item so we need to sort them
    buckets[bucketDate].sort(this.sort);
    matches.push(buckets[bucketDate][0].item);
  }

  return matches;
};
ExceptFirstFilter.prototype.mixin = function(object) {
  for (var property in object) {
    if (object.hasOwnProperty(property)) {
      this[property] = object[property];
    }
  }
};
ExceptFirstFilter.prototype.sort = function(a, b) {
  if (a.date < b.date) {
    return -1;
  }
  else if (a.date > b.date) {
    return 1;
  }
  return 0;
};
module.exports = ExceptFirstFilter;
