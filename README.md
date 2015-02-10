# Rotatelib

<img src="https://travis-ci.org/robballou/js-rotatelib.svg" alt="Build status" />

This is a JavaScript port of [rotatelib](https://github.com/robballou/rotatelib).

```javascript
var rotatelib = require('rotatelib');

var items = rotatelib.list({
  directory: 'backups',
  before: '2014-01-01'
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
