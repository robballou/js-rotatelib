// var dateParser = require('../mixins/date_parser.js');
import { dateParser } from '../mixins/date_parser.mjs';

/**
 * ExceptFirstFilter
 */
export class ExceptFirstFilter {
    constructor() {
        this.dateParser = dateParser;
        this.param = 'except_first';
    }

    applies(params) {
        return this.param in params && (params[this.param] === 'day' || params[this.param] === 'month');
    }

    filter(items, params) {
        // matches will contain the things we need to return
        var matches = [];

        // get the items mapped into date based buckets
        var buckets = this.mapItems(items, params);

        // ignore the first item from each bucket
        for (var bucketDate in buckets) {
            if (buckets[bucketDate].length === 1) {
            // matches.push(buckets[bucketDate][0].item);
                continue;
            }

            // there is more than one item so we need to sort them
            buckets[bucketDate].sort(this.sort);

            // now take everything except the first item
            buckets[bucketDate].shift();
            buckets[bucketDate].forEach((thisItem) => {
                matches.push(thisItem.item);
            });
        }

        return matches;
    }

    mapItems(items, params) {
        var self = this;
        var buckets = {};

        items.forEach((item) => {
            var parsed = self.dateParser.parseDate(item);
            if (parsed) {
                var thisDate = parsed.date.format('YYYYMM');
                if (params[self.param] === 'day') {
                    thisDate += parsed.date.format('DD');
                }

                if (!Object.prototype.hasOwnProperty.call(buckets, thisDate)) {
                    buckets[thisDate] = [];
                }

                buckets[thisDate].push(parsed);
            }
        });
        return buckets;
    }

    sort(a, b) {
        if (a.date < b.date) { return -1; }
        else if (a.date > b.date) { return 1; }
        return 0;
    }

    option(program) {
        program.option('--except-first <day|month>', 'Exclude the first item on a day or a month', /^(day|month)$/i);
        return 'exceptFirst';
    }
}

