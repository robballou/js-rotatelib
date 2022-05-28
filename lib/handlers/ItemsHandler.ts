import { Params, ListItem } from '../../types';
import { HandlerBase } from './HandlerBase';

export class ItemsHandler extends HandlerBase {
  applies(params: Partial<Params>): boolean {
    return 'items' in params && Array.isArray(params.items);
  }

  list(params: Partial<Params>): (string|ListItem)[] {
    if ('items' in params && params.items) {
      return params.items;
    }

    return [];
  }
}
