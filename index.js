// const criteria = require('./lib/criteria.js');
// const filters = require('./lib/filters.js');
// const handlers = require('./lib/handlers.js');
import debug from 'debug';

import { criteria } from './lib/criteria.mjs';
import { filters } from './lib/filters.mjs';
import { handlers } from './lib/handlers.mjs';

export class Rotatelib {
    debug = debug('rotatelib');

    /**
    * Add a new criteria item.
    */
    addCriteria(key, obj) {
        criteria[key] = obj;
    }

    /**
    * Figure out the applicable criteria items for this request.
    */
    getApplicableCriteria(params) {
        const criteriaItems = [];
        for (const property in criteria) {
            if (property.substr(0, 1) !== '_') {
                const criteriaItem = criteria[property];
                if (criteriaItem.applies(params)) {
                    if (params.debug) {
                        console.log(property);
                    }
                    criteriaItems.push(criteriaItem);
                }
            }
        }
        return criteriaItems;
    }

    /**
    * Figure out the applicable filters for this request.
    */
    getApplicableFilters(params) {
        var filterItems = [];
        for (var filter in filters) {
            if (filter.substr(0, 1) !== '_' && Object.prototype.hasOwnProperty.call(filters, filter)) {
                var filterItem = filters[filter];
                if (filterItem.applies(params)) {
                    filterItems.push(filterItem);
                }
            }
        }
        return filterItems;
    }

    /**
    * Figure out what handler to use
    */
    getHandler(params) {
        for (var handler in handlers) {
            if (Object.prototype.hasOwnProperty.call(handlers, handler)) {
                var thisHandler = handlers[handler];
                if (thisHandler.applies(params)) {
                    return thisHandler;
                }
            }
        }
    }

    /**
    * List out items that match the criteria.
    */
    async list(params) {
        this.debug('list()', params);

        let items = [];
        const applyCriteria = this.getApplicableCriteria(params);
        const applyFilters = this.getApplicableFilters(params);
        this.debug('list()', { applyCriteria, applyFilters });

        if (typeof params.debug === 'undefined') {
            params.debug = false;
        }

        // list items from the items param
        if ('items' in params) {
            this.debug('list() using supplied items');
            params.items.forEach((item) => {
                if (this.matchesCriteria(item, params, applyCriteria)) {
                    if (params.debug) {
                        console.log(item);
                    }
                    items.push(item);
                }
            });

            if (applyFilters) {
                applyFilters.forEach((filter) => {
                    items = filter.filter(items, params);
                });
            }
            return items;
        }

        // this is handled elsewhere
        const handler = this.getHandler(params);
        if (handler) {
            handler.rotatelib = this;
            items = await handler.list(params);
        }

        return items;
    }

    /**
    * List archives.
    */
    listArchives(params) {
        params.patterns = '*.gz, *.bz2, *.tgz';
        return this.list(params);
    }

    /**
    * Check if the item matches the criteria.
    */
    matchesCriteria(item, params, matchCriteria) {
        if (matchCriteria.length === 0) {
            if (params.debug) {
                console.log('no criteria');
            }
            return false;
        }

        for (var i = 0, count = matchCriteria.length; i < count; i++) {
            var result = matchCriteria[i].matches(item, params);
            if (!result) {
                // stop right now
                return false;
            }
        }
        return true;
    }

    /**
    * Remove items.
    */
    removeItems(items, params) {
        // figure out the handler for this case
        var handler = this.getHandler(params);
        if (handler) {
            handler.rotatelib = this;
            return handler.removeItems(items, params);
        }
    }

}
