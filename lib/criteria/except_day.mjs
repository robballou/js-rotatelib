// var util = require('util'),
//   moment = require('moment'),
//   HasDateCriteria = require('./has_date.js');

import { HasDateCriteria } from './has_date.mjs';

/**
 * ExceptDayCriteria
 *
 * Tests if the item is from before a given date.
 */
export class ExceptDayCriteria extends HasDateCriteria {
    applies(params) {
        return 'except_day' in params;
    }

    matches(item, params) {
        if (!Array.isArray(params.except_day)) {
            params.except_day = [params.except_day];
        }

        const parsed = this.hasDate(item);
        if (parsed) {
            // if the date is in the params, return 1
            if (params.except_day.indexOf(parsed.date.date()) < 0) {
                return 1;
            }
        }
        return 0;
    }

    option(program) {
        program.option('--except-day <day>', 'Select items that do not occur on a day of the month', parseInt);
        return 'exceptDay';
    }
}
