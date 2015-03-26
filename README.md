# Rotatelib

<img src="https://travis-ci.org/robballou/js-rotatelib.svg" alt="Build status" />

This is a JavaScript port of [rotatelib](https://github.com/robballou/rotatelib). So alpha.

```javascript
var rotatelib = require('rotatelib');

// list the files within 'backups' directory that are dated before 2014-01-01
var params = {
  directory: 'backups',
  before: '2014-01-01'
};
rotatelib
  .list(params)
  .then(function(items) {
    rotatelib.removeItems(items, params);
  });
```

Primarily, the library helps you list items you may want to act on based on date information in filenames and provides basic actions like removing those items. The commands use promises (via Q) to handle those actions that may be asynchronous.

## Criteria

A list of criteria that can be applied.

- `after` (moment or moment parseable string): return items with a date after the provided date(s) **implemented**
- `before` (moment or moment parseable string): return items with a date before the provided date(s) **implemented**
- `day` (int or array of ints): return items with the day of the month provided **implemented**
- `except_day` (int or array of ints): return items not in the provided days of the month **implemented**
- `except_hour` (int or array of ints): return items not in the provided hours of the day **implemented**
- `except_startswith` (string or array of strings): return items that does not start with a string **implemented**
- `except_year` (int or array of ints): return items that not in a given year **implemented**
- `has_date` (true/false): return only items with dates. Any date based criteria will automatically add this criteria. **implemented**
- `hour` (int or array of ints): return items only from a given hour **implemented**
- `is_archive` (true/false): return items that are archived (true=items are archives, false=items are not) **implemented**
- `startswith` (string or array of strings): return items that start with a string **implemented**
- `pattern` (regex): return items that match a Regular Expression **implemented**
- `year` (int or array of ints): return items in a given year **implemented**

The criteria `before` and `after` can accept [a moment](http://momentjs.com), a moment-parseable strings, or relative values:

- today
- yesterday
- tomorrow
- +1 week
- -1 day
- -2 years

These are shortcuts to the [add/subtract methods of Moment.js](http://momentjs.com/docs/#/manipulating/).

## Filters

Similar to criteria except they can act on the entire set. Current filters:

- except_first ('day' or 'month') **implemented**
- except_last ('day' or 'month') **implemented**

For example, if you want all the items older than 5 days, but keep the first item per day:

```javascript
rotatelib.list({
  before: moment.subtract(5, 'days'),
  except_first: 'day'
})
```

## Command line

The command line allows you to access rotatelib functionality via CLI.

```
Usage: rotatelib [options]

Options:

  -h, --help                    output usage information
  -V, --version                 output the version number
  --after <date>                Select items after the given date
  --before <date>               Select items before the given date
  --day <day>                   Select items that occur on a day of the month
  --except-day <day>            Select items that do not occur on a day of the month
  --has-date                    Select items that have a parseable date
  --hour <hour>                 Select items that occur in an hour
  --is-archive                  The item is an archive
  --except-hour <hour>          Select items that do not occur in a given hour
  --startswith <string>         Select items that start with this string
  --except-startswith <string>  Select items that do not start with this string
  --year <year>                 Select items that occur in a year
  --except-year <year>          Select items that do not start with this string
  --pattern <pattern>           Select items that match a pttern
  --except-first <day|month>    Exclude the first item on a day or a month
  --except-last <day|month>     Exclude the last item on a day or a month
  --remove                      Remove matched items
  --no-prompt                   Do not prompt, assume yes
```

Example 1: List items before a day:

    rotatelib --before 2015-01-01 ~/backups

Example 2: Remove items before 1/1, except the last item per month:

    rotatelib --before 2015-01-01 --except-last month ~/backups --remove

By default, `--remove` will prompt to confirm, but you can disable that with `--no-prompt`.

Example 3: Use `xargs` to do other things with items like gzipping files:

    rotatelib --before 2015-01-01 --startswith db ~/backups | xargs gzip

## Project Goals

So why port this to JS?

1. Cause I can :stuck_out_tongue_winking_eye:
1. I'm interested in trying to have this work with tools like [Gulp](http://gulpjs.com).
1. Getting into npm is worlds easier than getting into pip.
1. With `execSync` in 0.12 (and iojs), some of this library makes more sense. Also there are libraries for AWS and probably other things.
