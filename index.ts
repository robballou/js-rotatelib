import filters from './lib/filters';
import handlers from './lib/handlers';
import { Criteria } from './lib/criteria';
import type { Params, RotatelibConfig } from './types';
import { enableDebug } from './lib/enableDebug';
import Debug from 'debug';

export class Rotatelib {
  debug = Debug('rotatelib');
  protected criteria: Criteria;
  filters: Record<string, unknown> = {};
  handlers: Record<string, unknown> = {};

  constructor(config: RotatelibConfig = {}) {
    this.criteria = config.criteria ?? new Criteria(config.criteriaConfig);
  }

  /**
   * Add a new criteria item.
   */
  addCriteria(key: string, obj: unknown) {
    // this.criteria[key] = obj;
  }

  /**
   * Figure out the applicable criteria items for this request.
   */
  getApplicableCriteria(params: Partial<Params>) {
    const criteriaItems: any[] = [];
    // for (const property in this.criteria) {
    //   if (Object.hasOwnProperty.call(this.criteria, property) && property.substr(0, 1) !== '_') {
    //     const criteriaItem = this.criteria[property];
    //     if (criteriaItem.applies(params)) {
    //       if (params.debug) {
    //         console.log(property);
    //       }
    //       criteriaItems.push(criteriaItem);
    //     }
    //   }
    // }
    return criteriaItems;
  }

  getApplicableFilters(params: Partial<Params>): any[] {
    const filterItems: any[] = [];
    // for (const filter in this.filters) {
    //   if (filter.substr(0, 1) !== '_' && Object.hasOwnProperty.call(this.filters, filter)) {
    //     const filterItem = this.filters[filter];
    //     if (filterItem.applies(params)) {
    //       filterItems.push(filterItem);
    //     }
    //   }
    // }
    return filterItems;
  }

  /**
   * Figure out what handler to use
   */
  getHandler(params: Partial<Params>) {
    // for (const handler in this.handlers) {
    //   if (Object.hasOwnProperty.call(this.handlers, handler)) {
    //     const thisHandler = this.handlers[handler];
    //     if (thisHandler.applies(params)) {
    //       return thisHandler;
    //     }
    //   }
    // }
  }

  /**
   * List out items that match the criteria.
   */
  list(params: Partial<Params>) {
    const items: string[] = [];

    enableDebug(params);

    if (params.items) {
      params.items.forEach((item) => {
        if (this.matchesCriteria(item, params)) {
          this.debug(`Matched ${item}`);
          items.push(item);
        }
      });
    }

    // if (typeof params.debug === 'undefined') {
    //   params.debug = false;
    // }

    // // list items from the items param
    // if (params.items) {
    //   params.items.forEach((item) => {
    //     if (this.matchesCriteria(item, params, applyCriteria)) {
    //       if (params.debug) {
    //         console.log(item);
    //       }
    //       items.push(item);
    //     }
    //   });

    //   if (applyFilters) {
    //     applyFilters.forEach((filter) => {
    //       items = filter.filter(items, params);
    //     });
    //   }
    //   return items;
    // }

    // // this is handled elsewhere
    // const handler = this.getHandler(params);
    // if (handler) {
    //   handler.rotatelib = this;
    //   return handler.list(params);
    // }

    return items;
  }

  /**
   * List archives.
   */
  listArchives(params: Partial<Params>) {
    params.pattern = /\.{gz,bz2,zip}$/;
    return this.list(params);
  }

  /**
   * Check if the item matches the criteria.
   */
  matchesCriteria(item: string, params: Partial<Params>) {
    return this.criteria.test(params, item);
  }

  /**
   * Remove items.
   */
  removeItems(items: any[], params: Partial<Params>) {
    // figure out the handler for this case
    // const handler = this.getHandler(params);
    // if (handler) {
    //   handler.rotatelib = this;
    //   return handler.removeItems(items, params);
    // }
  }
}

