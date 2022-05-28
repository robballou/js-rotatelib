import type { Criteria } from '../criteria';

export abstract class CriterionBase {
  protected parent: Criteria;
  constructor(parent: Criteria) {
    this.parent = parent;
  }

  getInverseName(): string|null {
    return null;
  }

  hasInverse(): boolean {
    return false;
  }

  abstract testItem(params: Record<string, unknown>, item: string): boolean;

  testItemInverse(params: Record<string, unknown>, item: string): boolean {
    return false;
  }
}
