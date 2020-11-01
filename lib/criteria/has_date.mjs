// const util = require('util');
// const BaseCriteria = require('./base.js');
// const date_parser = require('../mixins/date_parser.js');
// const relative_dates = require('../mixins/relative_dates.js');
import { BaseCriteria } from './base.mjs';
import { dateParser } from '../mixins/date_parser.mjs';
import { relativeDates } from '../mixins/relative_dates.mjs';

export class HasDateCriteria extends BaseCriteria {
    constructor() {
        super();
        this.dateParser = dateParser;
        this.relativeDates = relativeDates;
    }

    applies(params) {
        return 'has_date' in params;
    }

    hasDate(item) {
        let parsed;

        // if this is a string, just test against it
        if (typeof item === 'string' || item instanceof String) {
            parsed = this.dateParser.parseDate(item);
        }

        if (parsed) {
            return parsed;
        }

        return false;
    }

    matches(item, params) {
        var result = this.hasDate(item);
        if ((result && params.has_date) || (!result && !params.has_date)) {
            return 1;
        }
        return 0;
    }

    option(program) {
        program.option('--has-date', 'Select items that have a parseable date');
        return 'hasDate';
    }
}
