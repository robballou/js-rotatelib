var extend = require('extend'),
  criteria = require('./lib/criteria.js'),
  handlers = require('./lib/handlers.js');

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
          criteriaItems.push(criteriaItem);
        }
      }
    }
    return criteriaItems;
  },

  getHandler: function(params) {
    for (var handler in handlers) {
      if (handlers.hasOwnProperty(handler)) {
        var thisHandler = handlers[handler];
        if (thisHandler.applies(params)) {
          return thisHandler;
        }
      }
    }
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

      return items;
    }

    var handler = rotatelib.getHandler(params);
    if (handler) {
      handler.rotatelib = this;
      return handler.list(params);
    }
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
  },

  /**
   * Remove items.
   */
  removeItems: function(items, params) {
    // figure out the handler for this case
    var handler = rotatelib.getHandler(params);
    return handler.removeItems(items, params);
  }

};

module.exports = rotatelib;
