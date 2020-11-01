import { HasDateCriteria } from './has_date.mjs';

/**
 * AfterCriteria
 *
 * Tests if the item is from After a given date.
 */
export class AfterCriteria extends HasDateCriteria {
    applies(params) {
        return 'after' in params;
    }

    matches(item, params) {
        const parsed = this.hasDate(item);
        if (parsed) {
            const then = this.relativeDates.parseRelativeDate(params.after);
            if (then && then.isValid() && parsed.date > then) {
                return 1;
            }
        }
        return 0;
    }

    option(program) {
        program.option('--after <date>', 'Select items after the given date');
        return 'after';
    }
}
