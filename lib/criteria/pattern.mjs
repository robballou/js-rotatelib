// var util = require('util');
import { BaseCriteria } from './base.mjs'

/**
 * PatternCriteria
 *
 * Tests if the item matches the pattern.
 */
export class PatternCriteria extends BaseCriteria {
    applies(params) {
        return 'pattern' in params;
    }

    matches(item, params) {
        if (!Array.isArray(params.pattern)) {
            params.pattern = [params.pattern];
        }

        for (var i=0, c=params.pattern.length; i < c; i++) {
            if (params.pattern[i].test(item)) {
                return 1;
            }
        }
        return 0;
    }

    option(program) {
        program.option('--pattern <pattern>', 'Select items that match a pttern');
        return 'pattern';
    }
}
