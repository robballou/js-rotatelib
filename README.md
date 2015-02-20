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

## Criteria

A list of criteria that can be applied.

- `after` (moment or moment parseable string) **implemented**
- `before` (moment or moment parseable string) **implemented**
- `day` (int or array of ints) **implemented**
- `except_day` (int or array of ints) **implemented**
- `except_hour` (int or array of ints)
- `except_startswith` (string or array of strings)
- `except_year` (int or array of ints)
- `has_date` (true/false) **implemented**
- `hour` (int or array of ints)
- `startswith` (string or array of strings)
- `pattern` (regex)
- `year` (int or array of ints)

## Filters

Similar to criteria except they can act on the entire set. Current filters:

- except_first ('day' or 'month')
- except_last ('day' or 'month')

For example, if you want all the items older than 5 days, but keep the first item per day:

```javascript
rotatelib.list({
  before: moment.subtract(5, 'days'),
  except_first: 'day'
})
```

## Project Goals

So why port this to JS?

1. Cause I can :stuck_out_tongue_winking_eye:
1. I'm interested in trying to have this work with tools like [Gulp](http://gulpjs.com).
1. Getting into npm is worlds easier than getting into pip.
1. With `execSync` in 0.12 (and iojs), some of this library makes more sense. Also there are libraries for AWS and probably other things.
