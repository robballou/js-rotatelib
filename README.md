# Rotatelib

This is a JavaScript port of [rotatelib](https://github.com/robballou/rotatelib).

```javascript
var rotatelib = require('rotatelib');

var items = rotatelib.list({
  directory: 'backups',
  before: '2014-01-01'
});

```

## Criteria

- after (moment or moment parseable string) x
- before (moment or moment parseable string) x
- day (int or array of ints)
- except_day (int or array of ints)
- except_hour (int or array of ints)
- except_startswith (string or array of strings)
- except_year (int or array of ints)
- has_date (true/false) x
- hour (int or array of ints)
- startswith (string or array of strings)
- pattern (regex)
- year (int or array of ints)
