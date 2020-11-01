// var util = require('util'),
//     moment = require('moment'),
//     HasDateCriteria = require('./has_date.js');

import { HasDateCriteria } from './has_date.mjs';

/**
 * DayCriteria
 *
 * Tests if the item is from before a given date.
 */
export class DayCriteria extends HasDateCriteria {
    applies(params) {
        return 'day' in params;
    }

    matches(item, params) {
        if (!Array.isArray(params.day)) {
            params.day = [params.day];
        }

        const parsed = this.hasDate(item);
        if (parsed) {
            // if the date is in the params, return 1
            if (params.day.indexOf(parsed.date.date()) >= 0) {
                return 1;
            }
        }
        return 0;
    }

    option(program) {
        program.option('--day <day>', 'Select items that occur on a day of the month', parseInt);
        return 'day';
    }
}
