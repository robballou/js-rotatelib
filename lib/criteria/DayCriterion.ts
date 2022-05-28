import { CriterionBase } from './CriterionBase';
import { Criterion } from '../../types';
import { dateService } from '../services/DateService';
import Debug from 'debug';

type DayParams = Pick<Criterion, 'day'>;
type ExceptDayParams = Pick<Criterion, 'exceptDay'>;

export class DayCriterion extends CriterionBase {
  debug = Debug('rotatelib:DayCriteria');

  getInverseName(): string | null {
    return 'exceptDay';
  }

  hasInverse() {
    return true;
  }

  testItem(params: DayParams, item: string): boolean {
    const date = dateService.parseDate(item);
    if (!date) {
      return false;
    }

    const days = !Array.isArray(params.day) ? [params.day] : params.day;
    this.debug(`Testing [${date.day}] against ${days}`);
    return days.includes(date.day);
  }

  testItemInverse(params: ExceptDayParams, item: string): boolean {
    return !this.testItem({ day: params.exceptDay }, item);
  }
}
