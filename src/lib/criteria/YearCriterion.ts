import { CriterionBase } from './CriterionBase';
import { Criterion } from '../../types';
import { dateService } from '../services/DateService';

type YearParams = Pick<Criterion, 'year'>;
type ExceptYearParams = Pick<Criterion, 'exceptYear'>;

export class YearCriterion extends CriterionBase {
	getInverseName(): string | null {
		return 'exceptYear';
	}

	hasInverse() {
		return true;
	}

	testItem(params: YearParams, item: string): boolean {
		const parsedDate = dateService.parseDate(item);
		if (!parsedDate) {
			return false;
		}

		const years = Array.isArray(params.year) ? params.year : [params.year];
		return years.includes(parsedDate.year);
	}

	testItemInverse(params: ExceptYearParams, item: string): boolean {
		return !this.testItem({ year: params.exceptYear }, item);
	}
}
