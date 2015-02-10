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
   * Figure out the applicable criteria items for this request.
   */
  getApplicableCriteria: function(params) {
    var criteriaItems = [];
    for (var property in criteria) {
      if (criteria.hasOwnProperty(property) && property.substr(0, 1) !== '_') {
        var criteriaItem = criteria[property];
        if (criteriaItem.applies(params)) {
          console.log(property);
          criteriaItems.push(criteriaItem);
        }
      }
    }
    return criteriaItems;
  },

  /**
   * List out items that match the criteria.
   */
  list: function(params) {
    var items = [],
      self = this,
      applyCriteria = rotatelib.getApplicableCriteria(params);

    // list items from the items param
    if (params.hasOwnProperty('items')) {
      params.items.forEach(function(item) {
        if (rotatelib.matchesCriteria(item, params, applyCriteria)) {
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
  matchesCriteria: function(item, params, criteria) {
    if (criteria.length === 0) {
      console.log('no criteria');
      return false;
    }

    for (var i=0, count=criteria.length; i<count; i++) {
      var result = criteria[i].matches(item, params);
      if (result === 0) {
        return false;
      }
    }
    return true;
  }

};

module.exports = rotatelib;
