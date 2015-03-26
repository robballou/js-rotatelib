var extend = require('extend'),
  criteria = require('./lib/criteria.js'),
  filters = require('./lib/filters.js'),
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
          if (params.debug) {
            console.log(property);
          }
          criteriaItems.push(criteriaItem);
        }
      }
    }
    return criteriaItems;
  },

  /**
   * Figure out the applicable filters for this request.
   */
  getApplicableFilters: function(params) {
    var filterItems = [];
    for (var filter in filters) {
      if (filter.substr(0, 1) !== '_' && filters.hasOwnProperty(filter)) {
        var filterItem = filters[filter];
        if (filterItem.applies(params)) {
          filterItems.push(filterItem);
        }
      }
    }
    return filterItems;
  },

  /**
   * Figure out what handler to use
   */
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
    var items = [];
    var self = this;
    var applyCriteria = rotatelib.getApplicableCriteria(params);
    var applyFilters = rotatelib.getApplicableFilters(params);

    if (typeof params.debug === 'undefined') {
      params.debug = false;
    }

    // list items from the items param
    if (params.hasOwnProperty('items')) {
      params.items.forEach(function(item) {
        if (rotatelib.matchesCriteria(item, params, applyCriteria)) {
          if (params.debug) {
            console.log(item);
          }
          items.push(item);
        }
      });

      if (applyFilters) {
        applyFilters.forEach(function(filter) {
          items = filter.filter(items, params);
        });
      }
      return items;
    }

    // this is handled elsewhere
    var handler = rotatelib.getHandler(params);
    if (handler) {
      handler.rotatelib = this;
      return handler.list(params);
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
      if (params.debug) {
        console.log('no criteria');
      }
      return false;
    }

    for (var i = 0, count = criteria.length; i < count; i++) {
      var result = criteria[i].matches(item, params);
      if (!result) {
        // stop right now
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
    if (handler) {
      handler.rotatelib = this;
      return handler.removeItems(items, params);
    }
  }

};

module.exports = rotatelib;
