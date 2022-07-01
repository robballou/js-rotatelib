import { CriterionBase } from './CriterionBase';
import { Criterion } from '../../types';

type PatternParams = Pick<Criterion, 'pattern'>;

export class PatternCriterion extends CriterionBase {
	testItem(params: PatternParams, item: string): boolean {
		return params.pattern.test(item);
	}
}
