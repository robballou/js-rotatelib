var should = require('should'),
  rotatelib = require('../index.js'),
  criteria = require('../lib/criteria.js');

describe('rotatelib', function() {

  describe('criteria', function() {

    describe('before', function() {
      it('is applicable', function() {
        criteria.before.applies({before: '2015-01-01'}).should.be.ok;
      });
    });

    describe('has_date', function() {

      it('is applicable', function() {
        criteria.has_date.applies({has_date: true}).should.be.ok;
      });

      var validDates = [
        // just date strings
        {string: '2014-01-01', answer: '2014-01-01'},
        {string: '2014-01-20', answer: '2014-01-20'},
        {string: '20140101', answer: '2014-01-01'},
        {string: '20140120', answer: '2014-01-20'},
        {string: '2014-01-20T13:00', answer: '2014-01-20 13:00:00', format: 'YYYY-MM-DD HH:mm:ss'},

        // strings with names in them
        {string: 'test-2009-06-29T1430-0700.bz2', answer: '2009-06-29 14:30:00', format: 'YYYY-MM-DD HH:mm:ss'},
        {string: 'test-2009-06-29T14-0700.bz2', answer: '2009-06-29 14:30:00', format: 'YYYY-MM-DD HH:mm:ss'},
        {string: 'test-20090629.bz2', answer: '2009-06-29'},
        {string: 'test-200906290130.bz2', answer: '2009-06-29 01:30:00', format: 'YYYY-MM-DD HH:mm:ss'}
      ];

      validDates.forEach(function(date) {
        it('parses date ' + date.string, function() {
          var parsed = criteria.has_date.parseDate(date.string);
          parsed.should.be.ok;
          parsed.date.isValid().should.be.ok;

          var format = 'YYYY-MM-DD';
          if (date.hasOwnProperty('format')) {
            format = date.format;
          }
          parsed.date.format(format).should.equal(date.answer);
        });
      });

      it('does not parse invalid things', function() {
        criteria.has_date.parseDate('asdf').should.not.be.ok;
      });
    });
  });

  describe('filesystem', function() {
    describe('list()', function() {
      it('returns everything by default', function() {
        var items = rotatelib.list({
          items: [
            'example.txt',
            'README.md',
            'file20141231.txt',
            'file2014.txt'
          ]
        });

        items.should.have.length(4);
      });

      it('returns things with dates with has_date', function() {
        var items = rotatelib.list({
          items: [
            'example.txt',
            'README.md',
            'file20141231.txt',
            'file2014.txt'
          ],
          has_date: true
        });

        items.should.have.length(2);
        items.should.containEql('file2014.txt');
        items.should.not.containEql('example.txt');
      });
    });

  });
});
