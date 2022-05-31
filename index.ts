import { Criteria } from './lib/criteria';
import type { Params, RotatelibConfig, ListItem, ListParams } from './types';
import { enableDebug } from './lib/enableDebug';
import Debug from 'debug';
import type { HandlerBase } from './lib/handlers/HandlerBase';
import { ItemsHandler } from './lib/handlers/ItemsHandler';

export class Rotatelib {
  debug = Debug('rotatelib');
  protected criteria: Criteria;
  filters: Record<string, unknown> = {};
  handlers: HandlerBase[] = [];

  constructor(config: RotatelibConfig = {}) {
    this.criteria = config.criteria ?? new Criteria(config.criteriaConfig);
    if (config.handlers) {
      config.handlers.forEach((handler) => this.addHandler(handler));
    }
    else {
      this.addHandler(new ItemsHandler());
    }
  }

  /**
   * Add a new criteria item.
   */
  addCriteria(key: string, obj: unknown) {
    // this.criteria[key] = obj;
  }

  /**
   * Add a new item handler.
   *
   * Item handlers deal with various systems (filesystems, APIs) to determine
   * what items exist and to perform actions on those items.
   */
  addHandler(handler: HandlerBase): this {
    this.handlers.push(handler);
    return this;
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
    for (const handler in this.handlers) {
      if (Object.hasOwnProperty.call(this.handlers, handler)) {
        const thisHandler = this.handlers[handler];
        if (thisHandler.applies(params)) {
          return thisHandler;
        }
      }
    }
  }

  /**
   * List out items that match the criteria.
   */
  async list(params: ListParams) {
    enableDebug(params);

    const handler = this.getHandler(params);

    if (!handler) {
      throw new Error('Could not find a item handler that applies for this set of params');
    }

    const rawItems = await handler.list(params);

    this.debug(`Found ${rawItems.length} item${rawItems.length !== 1 ? 's' : ''}. Filtering...`);
    const items = rawItems.filter(this.matchesCriteria(params));
    this.debug(`Filtered down to ${items.length}`);
    return items;
  }

  /**
   * List archives.
   *
   * @deprecated Use list({ isArchive: true }) instead
   */
  async listArchives(params: ListParams) {
    params.pattern = /\.{gz,bz2,zip}$/;
    return this.list(params);
  }

  /**
   * Check if the item matches the criteria.
   */
  matchesCriteria(params: Partial<Params>) {
    return (item: string|ListItem) => {
      const testString = (typeof item !== 'string') ? item.toString() : item;
      return this.criteria.test(params, testString);
    };
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

