var moment = require('moment');

var date_parser = {
  patterns: [
    // YYYYMMDD, YYYY-MM-DD
    {
      pattern: /^.*(\d{4})-?(\d{2})-?(\d{2}).*$/,
      matches: {
        year: 1,
        month: 2,
        day: 3
      }
    },

    // YYYYMMDDHH-ZONE, YYYYMMDDTHH-ZONE
    {
      pattern: /^.*(\d{4})-?(\d{2})-?(\d{2})T?(\d{2})-(\d{4}).*$/,
      matches: {
        year: 1,
        month: 2,
        day: 3,
        hour: 4
      }
    },

    // YYYYMMDDHHMM, YYYYMMDDTHHMM
    {
      pattern: /^.*(\d{4})-?(\d{2})-?(\d{2})T?(\d{2}):?(\d{2}).*$/,
      matches: {
        year: 1,
        month: 2,
        day: 3,
        hour: 4,
        minute: 5
      }
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
        second: 6
      }
    },

  ],

  parseDate: function(item) {
    var result = null;

    // loop through the patterns and see if we can find matches
    for (var i=0, c=this.patterns.length; i<c; i++) {
      var thisPattern = this.patterns[i],
        results = thisPattern.pattern.exec(item);

      // we have some results, but we want to keep going until the more
      // specific results later (if possible).
      if (results) {
        var date = this.regexResultToString(results, thisPattern);
        result = {'item': item, 'date': date};
      }
    }

    if (result) {
      return result;
    }

    return false;
  },

  regexResultToString: function(results, pattern) {
    var date = moment();

    if (pattern.matches.hasOwnProperty('year')) {
      date.year(this.stripZeroLead(results[pattern.matches.year]));
    }

    if (pattern.matches.hasOwnProperty('month')) {
      month = parseInt(this.stripZeroLead(results[pattern.matches.month]), 10) - 1;
      date.month(month);
    }

    if (pattern.matches.hasOwnProperty('day')) {
      date.date(this.stripZeroLead(results[pattern.matches.day]));
    }

    if (pattern.matches.hasOwnProperty('hour')) {
      date.hour(this.stripZeroLead(results[pattern.matches.hour]));
    }
    else {
      date.hour(0);
    }

    if (pattern.matches.hasOwnProperty('minute')) {
      date.minute(this.stripZeroLead(results[pattern.matches.minute]));
    }
    else {
      date.minute(0);
    }

    if (pattern.matches.hasOwnProperty('second')) {
      date.second(this.stripZeroLead(results[pattern.matches.second]));
    }
    else {
      date.second(0);
    }

    return date;
  },

  stripZeroLead: function(str) {
    if (str[0] === '0') {
      return str.substr(1);
    }
    return str;
  }
};
module.exports = date_parser;
