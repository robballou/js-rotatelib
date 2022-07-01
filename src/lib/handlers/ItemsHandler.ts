import { ListItem, ItemsParams, RotateItem } from '../../types';
import { HandlerBase } from './HandlerBase';

export class ItemsHandler extends HandlerBase {
	async action(action: string, items: RotateItem[]): Promise<boolean> {
		console.warn('The ItemsHandler has no supported actions', { action, items });
		return true;
	}

	applies(params: Partial<ItemsParams>): boolean {
		return 'items' in params && Array.isArray(params.items);
	}

	async list(params: ItemsParams): Promise<(string|ListItem)[]> {
		if ('items' in params && params.items) {
			return params.items;
		}

		return [];
	}
}
