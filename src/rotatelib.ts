import { Criteria } from './lib/criteria';
import type { Params, RotatelibConfig, ListItem, ListParams, RotateItem, Action } from './types';
import { enableDebug } from './lib/enableDebug';
import Debug from 'debug';
import type { HandlerBase } from './lib/handlers/HandlerBase';
import { ItemsHandler } from './lib/handlers/ItemsHandler';
import { Filter } from './lib/filter';

/**
 * Main rotatelib class
 */
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

	async action(action: Action, items: RotateItem[], params: Partial<Params>, actionConfig: Record<string, unknown> = {}): Promise<boolean> {
		const handler = this.getHandler(params);
		if (!handler) {
			throw new Error('Could not find handler');
		}
		return handler.action(action, items, actionConfig);
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

		// TODO: filters should be applied via the handler so it can differentiate between folders/etc
		const items = this.filterItems(
			rawItems.filter(this.matchesCriteria(params)),
			params
		);

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

	filterItems(items: RotateItem[], params: Partial<Params>) {
		// escape hatch for when we are not filtering items
		if (!('exceptFirst' in params) && !('exceptLast' in params)) {
			return items;
		}

		const filter = new Filter();
		const filteredItems = filter.apply(params, items);
		return filteredItems;
	}
}

