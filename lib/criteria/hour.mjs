// var util = require('util'),
//     moment = require('moment'),
//     HasDateCriteria = require('./has_date.js');

import { HasDateCriteria } from './has_date.mjs';

/**
 * HourCriteria
 *
 * Tests if the item is from the given hour.
 */
export class HourCriteria extends HasDateCriteria {
    applies(params) {
        return 'hour' in params;
    }

    matches(item, params) {
        if (!Array.isArray(params.hour)) {
            params.hour = [params.hour];
        }

        var parsed = this.hasDate(item);
        if (parsed) {
            // if the date is in the params, return 1
            if (params.hour.indexOf(parsed.date.hour()) >= 0) {
                return 1;
            }
        }
        return 0;
    }

    option(program) {
        program.option('--hour <hour>', 'Select items that occur in an hour');
        return 'hour';
    }
}
