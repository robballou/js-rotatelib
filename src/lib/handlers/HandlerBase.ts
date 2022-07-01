import type { Params, RotateItem } from '../../types';

export abstract class HandlerBase {
  abstract action(action: string, items: RotateItem[], actionConfig: Record<string, unknown>): Promise<boolean>;
  abstract applies(params: Partial<Params>): boolean;
  abstract list(params: Partial<Params>): Promise<RotateItem[]>;
}
