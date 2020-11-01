import chai from 'chai';
import moment from 'moment';

chai.should();

import { Rotatelib } from '../index.js'
import { criteria } from '../lib/criteria.mjs';
import { filters } from '../lib/filters.mjs';

const rotatelib = new Rotatelib();


describe('rotatelib', () => {

    describe('criteria', () => {

        describe('after', () => {
            it('is applicable', () => {
                criteria.after.applies({ after: '2015-01-01' }).should.be.ok;
            });

            it('returns items before a date', async () => {
                var items = await rotatelib.list({
                    items: [
                        'example.txt',
                        'README.md',
                        'file20141231.txt',
                        'file20150101.txt',
                    ],
                    after: '2014-01-01',
                });

                items.should.have.length(2);
                items.should.contains('file20141231.txt');
                items.should.contains('file20150101.txt');
            });

            it('returns no items after a date when nothing matches', async () => {
                var items = await rotatelib.list({
                    items: [
                        'example.txt',
                        'README.md',
                        'file20141231.txt',
                        'file20150101.txt',
                    ],
                    after: '2015-02-01',
                });

                items.should.have.length(0);
            });

            it('works with a moment', async () => {
                var items = await rotatelib.list({
                    items: [
                        'example.txt',
                        'README.md',
                        'file20141231.txt',
                        'file20150101.txt',
                    ],
                    after: moment('2014-01-01'),
                });

                items.should.have.length(2);
                items.should.contains('file20141231.txt');
                items.should.contains('file20150101.txt');
            });

            it('works with relative date', async () => {
                var today = moment(),
                    yesterday = moment().subtract(1, 'day'),
                    twoDaysAgo = moment().subtract(2, 'days');
                var items = [
                        'example.txt',
                        'README.md',
                        `file${today.format('YYYYMMDD')}.txt`,
                        `file${yesterday.format('YYYYMMDD')}.txt`,
                        `file${twoDaysAgo.format('YYYYMMDD')}.txt`,
                    ],
                    rotateItems = await rotatelib.list({
                        items: items,
                        after: '-1 day',
                    });

                rotateItems.should.have.length(1);
                rotateItems.should.contains(`file${today.format('YYYYMMDD')}.txt`);
            });
        });

        describe('before', () => {
            it('is applicable', () => {
                criteria.before.applies({ before: '2015-01-01' }).should.be.ok;
            });

            it('returns items before a date', async () => {
                var items = await rotatelib.list({
                    items: [
                        'example.txt',
                        'README.md',
                        'file20141231.txt',
                        'file20150101.txt',
                    ],
                    before: '2015-01-01',
                });

                items.should.have.length(1);
                items.should.contains('file20141231.txt');
            });

            it('returns no items before a date when nothing matches', async () => {
                var items = await rotatelib.list({
                    items: [
                        'example.txt',
                        'README.md',
                        'file20141231.txt',
                        'file20150101.txt',
                    ],
                    before: '2013-01-01',
                });

                items.should.have.length(0);
            });
        });

        describe('day', () => {
            it('is applicable', () => {
                criteria.day.applies({ day: 1 }).should.be.ok;
                criteria.day.applies({ day: [
                    1,
                    15,
                ] }).should.be.ok;
            });

            it('returns items with a day', async () => {
                var items = await rotatelib.list({
                    items: [
                        'example.txt',
                        'README.md',
                        'file20141231.txt',
                        'file20150101.txt',
                    ],
                    day: [
                        1,
                        5,
                    ],
                });

                items.should.have.length(1);
                items.should.contains('file20150101.txt');
            });

            it('returns no items when nothing matches', async () => {
                var items = await rotatelib.list({
                    items: [
                        'example.txt',
                        'README.md',
                        'file20141231.txt',
                        'file20150101.txt',
                    ],
                    day: 3,
                });

                items.should.have.length(0);
            });
        });

        describe('except_day', () => {
            it('is applicable', () => {
                criteria.except_day.applies({ except_day: 1 }).should.be.ok;
                criteria.except_day.applies({ except_day: [
                    1,
                    15,
                ] }).should.be.ok;
            });

            it('returns items except with a day', async () => {
                var items = await rotatelib.list({
                    items: [
                        'example.txt',
                        'README.md',
                        'file20141231.txt',
                        'file20150101.txt',
                    ],
                    except_day: [
                        1,
                        5,
                    ],
                });

                items.should.have.length(1);
                items.should.contains('file20141231.txt');
            });

            it('returns no items when nothing matches', async () => {
                var items = await rotatelib.list({
                    items: [
                        'example.txt',
                        'README.md',
                        'file20141231.txt',
                        'file20150101.txt',
                    ],
                    except_day: [
                        1,
                        31,
                    ],
                });

                items.should.have.length(0);
            });
        });

        describe('except_hour', () => {
            it('is applicable', () => {
                criteria.except_hour.applies({ except_hour: 1 }).should.be.ok;
                criteria.except_hour.applies({ except_hour: [
                    1,
                    13,
                ] }).should.be.ok;
            });

            it('returns items not in this hour', async () => {
                var itemsList = [
                    'example.txt',
                    'README.md',
                    'file20141231013000.txt',
                    'file20150101023000.txt',
                ];
                var items = await rotatelib.list({ items: itemsList, except_hour: 1 })
                items.should.have.length(1);
                items.should.contains('file20150101023000.txt');
                (await rotatelib.list({ items: itemsList, except_hour: [
                    1,
                    2,
                ] })).should.have.length(0);
            });

        });

        describe('except_startswith', () => {
            it('is applicable', () => {
                criteria.except_startswith.applies({ except_startswith: 'test' }).should.be.ok;
                criteria.except_startswith.applies({ except_startswith: [
                    'test',
                    'prod',
                ] }).should.be.ok;
            });

            it('returns items that do not start with string', async () => {
                var itemsList = [
                    'example.txt',
                    'README.md',
                    'file20141231013000.txt',
                    'file20150101023000.txt',
                ];
                var items = await rotatelib.list({ items: itemsList, except_startswith: 'file' })
                items.should.have.length(2);
                items.should.contains('README.md');
            });
        });

        describe('except_year', () => {
            it('is applicable', () => {
                criteria.except_year.applies({ except_year: 2014 }).should.be.ok;
                criteria.except_year.applies({ except_year: [
                    2015,
                    2014,
                ] }).should.be.ok;
            });

            it('returns items not in this year', async () => {
                var itemsList = [
                    'example.txt',
                    'README.md',
                    'file20141231013000.txt',
                    'file20150101023000.txt',
                ];
                var items = await rotatelib.list({ items: itemsList, except_year: 2014 })
                items.should.have.length(1);
                items.should.contains('file20150101023000.txt');
                (await rotatelib.list({ items: itemsList, except_year: [
                    2014,
                    2015,
                ] })).should.have.length(0);
            });
        });

        describe('before and day', () => {
            it('returns items correctly', async () => {
                var items = await rotatelib.list({
                    items: [
                        'example.txt',
                        'README.md',
                        'file20141231.txt',
                        'file20141201.txt',
                        'file20150101.txt',
                    ],
                    day: [
                        1,
                        5,
                    ],
                    before: '2015-01-01',
                });

                items.should.have.length(1);
                items.should.contains('file20141201.txt');
            });
        });

        describe('has_date', () => {

            it('is applicable', () => {
                criteria.has_date.applies({ has_date: true }).should.be.ok;
            });

            var validDates = [
                // just date strings
                { string: '2014-01-01', answer: '2014-01-01' },
                { string: '2014-01-20', answer: '2014-01-20' },
                { string: '20140101', answer: '2014-01-01' },
                { string: '20140120', answer: '2014-01-20' },
                { string: '20140120013000', answer: '2014-01-20 01:30:00', format: 'YYYY-MM-DD HH:mm:ss' },
                { string: '2014-01-20T13:00', answer: '2014-01-20 13:00:00', format: 'YYYY-MM-DD HH:mm:ss' },

                // strings with names in them
                { string: 'test-2009-06-29T1430-0700.bz2', answer: '2009-06-29 14:30:00', format: 'YYYY-MM-DD HH:mm:ss' },
                { string: 'test-2009-06-29T14-0700.bz2', answer: '2009-06-29 14:00:00', format: 'YYYY-MM-DD HH:mm:ss' },
                { string: 'test-20090629.bz2', answer: '2009-06-29' },
                { string: 'test-200906290130.bz2', answer: '2009-06-29 01:30:00', format: 'YYYY-MM-DD HH:mm:ss' },
                { string: 'test-2015-04-20T12-00-00_UTC_database.sql', answer: '2015-04-20 00:00:00', format: 'YYYY-MM-DD HH:mm:ss' },
            ];

            validDates.forEach((date) => {
                it(`parses date ${date.string}`, () => {
                    var parsed = criteria.has_date.dateParser.parseDate(date.string);
                    parsed.should.not.be.false;
                    parsed.should.be.an('object');
                    parsed.date.isValid().should.be.ok;

                    var format = 'YYYY-MM-DD';
                    if (date.hasOwnProperty('format')) {
                        format = date.format;
                    }
                    parsed.date.format(format).should.equal(date.answer);
                });
            });

            it('does not parse invalid things', () => {
                criteria.has_date.dateParser.parseDate('asdf').should.not.be.ok;
            });

            it('handles has_date=false', async () => {
                var items = await rotatelib.list({
                    items: [
                        'example.txt',
                        'README.md',
                        'file20141231.txt',
                        'file20150101.txt',
                    ],
                    has_date: false,
                });

                items.should.have.length(2);
                items.should.contains('README.md');
            });
        });

        describe('hour', () => {
            it('is applicable', () => {
                criteria.hour.applies({ hour: 1 }).should.be.ok;
                criteria.hour.applies({ hour: [
                    1,
                    13,
                ] }).should.be.ok;
            });

            it('returns items in this hour', async () => {
                var itemsList = [
                    'example.txt',
                    'README.md',
                    'file20141231013000.txt',
                    'file20150101023000.txt',
                ];
                var items = await rotatelib.list({ items: itemsList, hour: 1 })
                items.should.have.length(1);
                items.should.contains('file20141231013000.txt');
                (await rotatelib.list({ items: itemsList, hour: [
                    1,
                    2,
                ] })).should.have.length(2);
            });
        });

        describe('is_archive', () => {
            it('is applicable', () => {
                criteria.is_archive.applies({ is_archive: true }).should.be.ok;
            });

            it('returns items that are archives', async () => {
                var itemsList = [
                    'example.txt',
                    'example.zip',
                    'README.md',
                    'file20141231013000.gz',
                    'file20150101023000.txt',
                ];
                var items = await rotatelib.list({ items: itemsList, has_date: true, is_archive: true });
                items.should.have.length(1);
                items.should.contains('file20141231013000.gz');
            });

            it('returns items that are not archives', async () => {
                var itemsList = [
                    'example.txt',
                    'example.zip',
                    'README.md',
                    'file20141231013000.gz',
                    'file20150101023000.txt',
                ];
                var items = await rotatelib.list({ items: itemsList, has_date: true, is_archive: false });
                items.should.have.length(1);
                items.should.contains('file20150101023000.txt');
            });
        });

        describe('startswith', () => {
            it('is applicable', () => {
                criteria.startswith.applies({ startswith: 'test' }).should.be.ok;
                criteria.startswith.applies({ startswith: [
                    'test',
                    'stage',
                ] }).should.be.ok;
            });

            it('returns items that start with string', async () => {
                var itemsList = [
                    'example.txt',
                    'README.md',
                    'file20141231013000.txt',
                    'file20150101023000.txt',
                ];
                var items = await rotatelib.list({ items: itemsList, startswith: 'file' })
                items.should.have.length(2);
                items.should.contains('file20141231013000.txt');
            });
        });

        describe('pattern', () => {
            it('is applicable', () => {
                criteria.pattern.applies({ pattern: /^test/ }).should.be.ok;
            });

            it('returns items that match a pattern', async () => {
                var itemsList = [
                    'example.txt',
                    'README.md',
                    'file20141231013000.txt',
                    'file20150101023000.txt',
                ];
                var items = await rotatelib.list({ items: itemsList, pattern: /^file/ })
                items.should.have.length(2);
                items.should.contains('file20141231013000.txt');
            });
        });

        describe('year', () => {
            it('is applicable', () => {
                criteria.year.applies({ year: 2014 }).should.be.ok;
                criteria.year.applies({ year: [
                    2015,
                    2014,
                ] }).should.be.ok;
            });

            it('returns items not in this year', async () => {
                var itemsList = [
                    'example.txt',
                    'README.md',
                    'file20141231013000.txt',
                    'file20150101023000.txt',
                ];
                var items = await rotatelib.list({ items: itemsList, year: 2014 })
                items.should.have.length(1);
                items.should.contains('file20141231013000.txt');
                (await rotatelib.list({ items: itemsList, year: [
                    2014,
                    2015,
                ] })).should.have.length(2);
            });
        });
    });

    describe('default', () => {
        describe('list()', () => {
            it('returns everything by default', async () => {
                var items = await rotatelib.list({
                    items: [
                        'example.txt',
                        'README.md',
                        'file20141231.txt',
                        'file20150101.txt',
                    ],
                });

                items.should.have.length(4);
            });

            it('returns things with dates with has_date', async () => {
                var items = await rotatelib.list({
                    items: [
                        'example.txt',
                        'README.md',
                        'file20141231.txt',
                        'file20150101.txt',
                    ],
                    has_date: true,
                });

                items.should.have.length(2);
                items.should.contains('file20150101.txt');
                items.should.not.contains('example.txt');
            });
        });

    });

    describe('filters', () => {
        describe('except_first', () => {
            it('is applicable', () => {
                filters.except_first.applies({ except_first: 'day' }).should.be.ok;
            });

            it('filters out items by month', async () => {
                var items = [
                    'example.txt',
                    'README.md',
                    'file20141201.txt',
                    'file20141231.txt',
                    'file20150101.txt',
                ];

                var rotateItems = await rotatelib.list({ items: items, except_first: 'month' });
                rotateItems.should.have.length(1);
                rotateItems.should.contains('file20141231.txt');
            });

            it('filters out items by day', async () => {
                var items = [
                    'example.txt',
                    'README.md',
                    // 2014-12-01 01:30:00
                    'file20141201013000.txt',
                    // 2014-12-01 02:30:00
                    'file20141201023000.txt',
                    // 2014-12-31 01:30:00
                    'file20141231013000.txt',
                    // 2015-01-01 01:30:00
                    'file20150101013000.txt',
                ];

                var rotateItems = await rotatelib.list({ items: items, except_first: 'day' });
                rotateItems.should.have.length(1);
                rotateItems.should.contains('file20141201023000.txt');
            });
        });

        describe('except_last', () => {
            it('is applicable', () => {
                filters.except_last.applies({ except_last: 'day' }).should.be.ok;
            });

            it('filters out items by month', async () => {
                var items = [
                    'example.txt',
                    'README.md',
                    'file20141201.txt',
                    'file20141231.txt',
                    'file20150101.txt',
                ];

                var rotateItems = await rotatelib.list({ items: items, except_last: 'month' });
                rotateItems.should.have.length(1);
                rotateItems.should.contains('file20141201.txt');
            });

            it('filters out items by day', async () => {
                var items = [
                    'example.txt',
                    'README.md',
                    // 2014-12-01 01:30:00
                    'file20141201013000.txt',
                    // 2014-12-01 02:30:00
                    'file20141201023000.txt',
                    // 2014-12-31 01:30:00
                    'file20141231013000.txt',
                    // 2015-01-01 01:30:00
                    'file20150101013000.txt',
                ];

                var rotateItems = await rotatelib.list({ items: items, except_last: 'day' });
                rotateItems.should.have.length(1);
                rotateItems.should.contains('file20141201013000.txt');
            });
        });
    });
});
