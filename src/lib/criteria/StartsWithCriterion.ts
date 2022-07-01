import { CriterionBase } from './CriterionBase';
import { Criterion } from '../../types';

type StartsWithParams = Pick<Criterion, 'startsWith'>;
type ExceptStartsWithParams = Pick<Criterion, 'exceptStartsWith'>;

export class StartsWithCriterion extends CriterionBase {
	getInverseName(): string | null {
		return 'exceptStartsWith';
	}

	hasInverse() {
		return true;
	}

	testItem(params: StartsWithParams, item: string): boolean {
		const startsWith = Array.isArray(params.startsWith) ? params.startsWith : [params.startsWith];
		return startsWith.some((startsWithString) => item.startsWith(startsWithString));
	}

	testItemInverse(params: ExceptStartsWithParams, item: string): boolean {
		return !this.testItem({ startsWith: params.exceptStartsWith }, item);
	}
}
