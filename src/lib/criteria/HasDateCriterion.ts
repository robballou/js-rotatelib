import { DateTime } from 'luxon';
import { CriterionBase } from './CriterionBase';
import type { Criterion } from '../../types';
import { dateService } from '../services/DateService';

type HasDateParams = Pick<Criterion, 'hasDate'>;

export class HasDateCriterion extends CriterionBase {
	testItem(params: HasDateParams, item: string): boolean {
		const result = dateService.hasDate(item);
		if (result instanceof DateTime && params.hasDate) {
			return true;
		}
		else if (!params.hasDate && result === false) {
			return true;
		}
		return false;
	}
}
