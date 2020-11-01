import chai from 'chai';
import moment from 'moment';

import { RelativeDates } from '../lib/mixins/relative_dates.mjs';

chai.should();

const relative_dates = new RelativeDates();

describe('relative dates', () => {
    it('should parse "today"', () => {
        relative_dates.parseRelativeDate('today').format('YYYY-MM-DD')
            .should.equal(moment().format('YYYY-MM-DD'));
    });

    it('should parse "yesterday"', () => {
        relative_dates.parseRelativeDate('yesterday').format('YYYY-MM-DD')
            .should.equal(moment().subtract(1, 'day')
                .format('YYYY-MM-DD'));
    });

    it('should parse "tomorrow"', () => {
        relative_dates.parseRelativeDate('tomorrow').format('YYYY-MM-DD')
            .should.equal(moment().add(1, 'day')
                .format('YYYY-MM-DD'));
    });

    describe('should handle additive', () => {
        it('days', () => {
            relative_dates.parseRelativeDate('+1 day').format('YYYY-MM-DD')
                .should.equal(moment().add(1, 'day')
                    .format('YYYY-MM-DD'));
        });

        it('weeks', () => {
            relative_dates.parseRelativeDate('+1 week').format('YYYY-MM-DD')
                .should.equal(moment().add(1, 'week')
                    .format('YYYY-MM-DD'));
        });

        it('years', () => {
            relative_dates.parseRelativeDate('+1 year').format('YYYY-MM-DD')
                .should.equal(moment().add(1, 'year')
                    .format('YYYY-MM-DD'));
        });
    });

    describe('should handle subtractive', () => {
        it('days', () => {
            relative_dates.parseRelativeDate('-1 day').format('YYYY-MM-DD')
                .should.equal(moment().subtract(1, 'day')
                    .format('YYYY-MM-DD'));
        });

        it('weeks', () => {
            relative_dates.parseRelativeDate('-1 week').format('YYYY-MM-DD')
                .should.equal(moment().subtract(1, 'week')
                    .format('YYYY-MM-DD'));
        });

        it('years', () => {
            relative_dates.parseRelativeDate('-1 year').format('YYYY-MM-DD')
                .should.equal(moment().subtract(1, 'year')
                    .format('YYYY-MM-DD'));
        });
    });
});
