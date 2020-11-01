// var util = require('util'),
//     moment = require('moment'),
//     HasDateCriteria = require('./has_date.js');
import { HasDateCriteria } from './has_date.mjs';

/**
 * YearCriteria
 *
 * Tests if the item is not from the specified hour.
 */
export class YearCriteria extends HasDateCriteria {
    applies(params) {
        return 'year' in params;
    }

    matches(item, params) {
        if (!Array.isArray(params.year)) {
            params.year = [params.year];
        }

        var parsed = this.hasDate(item);
        if (parsed) {
            // if the date is in the params, return 1
            if (params.year.indexOf(parsed.date.year()) >= 0) {
                return 1;
            }
        }
        return 0;
    }

    option(program) {
        program.option('--year <year>', 'Select items that occur in a year', parseInt);
        return 'year';
    }
}
