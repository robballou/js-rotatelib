import { CriterionBase } from './CriterionBase';
import { Criterion } from '../../types';
import { dateService } from '../services/DateService';
import Debug from 'debug';

type HourParams = Pick<Criterion, 'hour'>;
type ExceptHourParams = Pick<Criterion, 'exceptHour'>;

export class HourCriterion extends CriterionBase {
	debug = Debug('rotatelib:HourCriterion');
	getInverseName(): string | null {
		return 'exceptHour';
	}

	hasInverse() {
		return true;
	}

	testItem(params: HourParams, item: string): boolean {
		const hours = Array.isArray(params.hour) ? params.hour : [params.hour];
		const parsedDate = dateService.parseDate(item);
		if (parsedDate === null) {
			this.debug(`Could not parse date for ${item}`);
			return false;
		}

		this.debug('Testing date to see if it is in', hours, parsedDate.hour);
		return hours.includes(parsedDate.hour);
	}

	testItemInverse(params: ExceptHourParams, item: string): boolean {
		return !this.testItem({ hour: params.exceptHour }, item);
	}
}
