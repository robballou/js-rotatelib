var extend = require('extend'),
  criteria = require('./lib/criteria.js');

var rotatelib = {
  /**
   * Add a new criteria item.
   */
  addCriteria: function(key, obj) {
    criteria[key] = obj;
  },

  /**
   * List out items that match the criteria.
   */
  list: function(params) {
    var items = [],
      self = this;

    // list items from the items param
    if (params.hasOwnProperty('items')) {
      params.items.forEach(function(item) {
        if (rotatelib.matchesCriteria(item, params)) {
          items.push(item);
        }
      });
    }

    return items;
  },

  /**
   * List archives.
   */
  listArchives: function(params) {
    params.patterns = '*.gz, *.bz2, *.tgz';
    return list(params);
  },

  /**
   * Check if the item matches the criteria.
   */
  matchesCriteria: function(item, params) {
    return criteria.default.matches(item, params);
  }

};

module.exports = rotatelib;
