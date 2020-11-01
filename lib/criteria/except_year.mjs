// var util = require('util'),
//   moment = require('moment'),
//   HasDateCriteria = require('./has_date.js');

import { HasDateCriteria } from './has_date.mjs';

/**
 * ExceptYearCriteria
 *
 * Tests if the item is not from the specified hour.
 */
export class ExceptYearCriteria extends HasDateCriteria {
    applies(params) {
        return 'except_year' in params;
    }

    matches(item, params) {
        if (!Array.isArray(params.except_year)) {
            params.except_year = [params.except_year];
        }

        var parsed = this.hasDate(item);
        if (parsed) {
            // if the date is in the params, return 1
            if (params.except_year.indexOf(parsed.date.year()) < 0) {
                return 1;
            }
        }
        return 0;
    }

    option(program) {
        program.option('--except-year <year>', 'Select items that do not start with this string', parseInt);
        return 'exceptYear';
    }
}
