// var util = require('util'),
//     moment = require('moment'),
//     HasDateCriteria = require('./has_date.js');

import { HasDateCriteria } from './has_date.mjs';

/**
 * ExceptHourCriteria
 *
 * Tests if the item is not from the specified hour.
 */
export class ExceptHourCriteria extends HasDateCriteria {
    applies(params) {
        return 'except_hour' in params;
    }

    matches(item, params) {
        if (!Array.isArray(params.except_hour)) {
            params.except_hour = [params.except_hour];
        }

        const parsed = this.hasDate(item);
        if (parsed) {
            // if the date is in the params, return 1
            if (params.except_hour.indexOf(parsed.date.hour()) < 0) {
                return 1;
            }
        }
        return 0;
    }

    option(program) {
        program.option('--except-hour <hour>', 'Select items that do not occur in a given hour', parseInt);
        return 'exceptHour';
    }
}
