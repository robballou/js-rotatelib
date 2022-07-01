import { CriterionBase } from './CriterionBase';
import { Criterion } from '../../types';
import { parseRelativeDate } from '../parse';
import { dateService } from '../services/DateService';

type BeforeParams = Pick<Criterion, 'before'>;

export class BeforeCriterion extends CriterionBase {
	testItem(params: BeforeParams, item: string): boolean {
		const date = dateService.hasDate(item);
		if (date) {
			const then = parseRelativeDate(params.before);
			if (then.isValid && date < then) {
				return true;
			}
		}
		return false;
	}
}
