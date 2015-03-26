var util = require('util'),
  ExceptFirstFilter = require('./except_first.js');

var ExceptLastFilter = function() {
  ExceptFirstFilter.call(this);
  this.param = 'except_last';
};
util.inherits(ExceptLastFilter, ExceptFirstFilter);
module.exports = ExceptLastFilter;
ExceptLastFilter.prototype.filter = function(items, params) {
  // matches will contain the things we need to return
  var matches = [],
    self = this;

  // get the items mapped into date based buckets
  var buckets = this.mapItems(items, params);

  // pick the last item from each bucket
  for (var bucketDate in buckets) {
    if (buckets[bucketDate].length === 1) {
      matches.push(buckets[bucketDate][0].item);
      continue;
    }

    // there is more than one item so we need to sort them
    buckets[bucketDate].sort(this.sort);
    matches.push(buckets[bucketDate][(buckets[bucketDate].length - 1)].item);
  }

  return matches;
};

ExceptLastFilter.prototype.option = function(program) {
  program.option('--except-last <day|month>', 'Exclude the last item on a day or a month', /^(day|month)$/i);
  return 'exceptLast';
};
