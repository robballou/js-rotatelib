var should = require('should'),
  moment = require('moment'),
  relative_dates = require('../lib/mixins/relative_dates.js');

describe('relative dates', function() {
  it('should parse "today"', function() {
    relative_dates.parseRelativeDate('today').format('YYYY-MM-DD')
      .should.equal(moment().format('YYYY-MM-DD'));
  });

  it('should parse "yesterday"', function() {
    relative_dates.parseRelativeDate('yesterday').format('YYYY-MM-DD')
      .should.equal(moment().subtract(1, 'day').format('YYYY-MM-DD'));
  });

  it('should parse "tomorrow"', function() {
    relative_dates.parseRelativeDate('tomorrow').format('YYYY-MM-DD')
      .should.equal(moment().add(1, 'day').format('YYYY-MM-DD'));
  });

  describe('should handle additive', function() {
    it('days', function() {
      relative_dates.parseRelativeDate('+1 day').format('YYYY-MM-DD')
        .should.equal(moment().add(1, 'day').format('YYYY-MM-DD'));
    });

    it('weeks', function() {
      relative_dates.parseRelativeDate('+1 week').format('YYYY-MM-DD')
        .should.equal(moment().add(1, 'week').format('YYYY-MM-DD'));
    });

    it('years', function() {
      relative_dates.parseRelativeDate('+1 year').format('YYYY-MM-DD')
        .should.equal(moment().add(1, 'year').format('YYYY-MM-DD'));
    });
  });

  describe('should handle subtractive', function() {
    it('days', function() {
      relative_dates.parseRelativeDate('-1 day').format('YYYY-MM-DD')
        .should.equal(moment().subtract(1, 'day').format('YYYY-MM-DD'));
    });

    it('weeks', function() {
      relative_dates.parseRelativeDate('-1 week').format('YYYY-MM-DD')
        .should.equal(moment().subtract(1, 'week').format('YYYY-MM-DD'));
    });

    it('years', function() {
      relative_dates.parseRelativeDate('-1 year').format('YYYY-MM-DD')
        .should.equal(moment().subtract(1, 'year').format('YYYY-MM-DD'));
    });
  });
});
