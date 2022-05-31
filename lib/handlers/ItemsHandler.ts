import { ListItem, ItemsParams } from '../../types';
import { HandlerBase } from './HandlerBase';

export class ItemsHandler extends HandlerBase {
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
