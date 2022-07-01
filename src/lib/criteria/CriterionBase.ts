import { Params } from '../../types';
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

	abstract testItem(params: Params, item: string): boolean;

	testItemInverse(params: Params, item: string): boolean {
		return !this.testItem(params, item);
	}
}
