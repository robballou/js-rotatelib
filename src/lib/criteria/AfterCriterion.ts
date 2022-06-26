import { CriterionBase } from './CriterionBase';
import { Criterion } from '../../types';
import { parseRelativeDate } from '../parse';
import { dateService } from '../services/DateService';

type AfterParams = Pick<Criterion, 'after'>;

export class AfterCriterion extends CriterionBase {
  testItem(params: AfterParams, item: string): boolean {
    const date = dateService.hasDate(item);
    if (date) {
      const then = parseRelativeDate(params.after);
      if (then.isValid && date > then) {
        return true;
      }
    }
    return false;
  }
}
