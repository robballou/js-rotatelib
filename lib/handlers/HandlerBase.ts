import type { Rotatelib } from '../../index';
import type { Params, ListItem } from '../../types';

export abstract class HandlerBase {
  abstract applies(params: Partial<Params>): boolean;
  abstract list(params: Partial<Params>): (string|ListItem)[];
}
