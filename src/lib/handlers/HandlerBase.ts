import type { Params, ListItem } from '../../types';

export abstract class HandlerBase {
  abstract applies(params: Partial<Params>): boolean;
  abstract list(params: Partial<Params>): Promise<(string|ListItem)[]>;
}
