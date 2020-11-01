import { HasDateCriteria } from './has_date.mjs';

/**
 * BeforeCriteria
 *
 * Tests if the item is from before a given date.
 */
export class BeforeCriteria extends HasDateCriteria {
    applies(params) {
        return 'before' in params;
    }

    matches(item, params) {
        const parsed = this.hasDate(item);
        if (parsed) {
            const then = this.relativeDates.parseRelativeDate(params.before);
            if (then && then.isValid() && parsed.date < then) {
                return 1;
            }
        }
        return 0;
    }

    option(program) {
        program.option('--before <date>', 'Select items before the given date');
        return 'before';
    }
}
