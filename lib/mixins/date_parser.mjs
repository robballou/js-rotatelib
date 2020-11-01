import moment from 'moment';

const patterns = [
    // YYYYMMDD, YYYY-MM-DD
    {
        pattern: /^.*(\d{4})-?(\d{2})-?(\d{2}).*$/,
        matches: {
            year: 1,
            month: 2,
            day: 3,
        },
    },

    // YYYYMMDDHH-ZONE, YYYYMMDDTHH-ZONE
    {
        pattern: /^.*(\d{4})-?(\d{2})-?(\d{2})T?(\d{2})-(\d{4}).*$/,
        matches: {
            year: 1,
            month: 2,
            day: 3,
            hour: 4,
        },
    },

    // YYYYMMDDHHMM, YYYYMMDDTHHMM
    {
        pattern: /^.*(\d{4})-?(\d{2})-?(\d{2})T?(\d{2}):?(\d{2}).*$/,
        matches: {
            year: 1,
            month: 2,
            day: 3,
            hour: 4,
            minute: 5,
        },
    },

    // YYYYMMDDHHMMSS, YYYYMMDDTHHMMSS
    {
        pattern: /^.*(\d{4})(\d{2})(\d{2})T?(\d{2}):?(\d{2}):?(\d{2}).*$/,
        matches: {
            year: 1,
            month: 2,
            day: 3,
            hour: 4,
            minute: 5,
            second: 6,
        },
    },
];

export class DateParser {
    parseDate(item) {
        var result = null;

        // loop through the patterns and see if we can find matches
        for (var i=0, c=patterns.length; i<c; i++) {
            var thisPattern = patterns[i],
                results = thisPattern.pattern.exec(item);

            // we have some results, but we want to keep going until the more
            // specific results later (if possible).
            if (results) {
                var date = this.regexResultToString(results, thisPattern);
                result = { item: item, date: date };
            }
        }

        if (result) {
            return result;
        }

        return false;
    }

    regexResultToString(results, pattern) {
        const date = moment();

        if ('year' in pattern.matches) {
            date.year(this.stripZeroLead(results[pattern.matches.year]));
        }

        if ('month' in pattern.matches) {
            const month = parseInt(this.stripZeroLead(results[pattern.matches.month]), 10) - 1;
            date.month(month);
        }

        if ('day' in pattern.matches) {
            date.date(this.stripZeroLead(results[pattern.matches.day]));
        }

        if ('hour' in pattern.matches) {
            date.hour(this.stripZeroLead(results[pattern.matches.hour]));
        }
        else {
            date.hour(0);
        }

        if ('minute' in pattern.matches) {
            date.minute(this.stripZeroLead(results[pattern.matches.minute]));
        }
        else {
            date.minute(0);
        }

        if ('second' in pattern.matches) {
            date.second(this.stripZeroLead(results[pattern.matches.second]));
        }
        else {
            date.second(0);
        }

        return date;
    }

    stripZeroLead(str) {
        if (str[0] === '0') {
            return str.substr(1);
        }
        return str;
    }
}

export const dateParser = new DateParser();
