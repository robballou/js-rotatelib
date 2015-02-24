var moment = require('moment');

/**
 * Handle parsing relative date strings into moments
 *
 * Handles:
 *
 * - today
 * - yesterday
 * - tomorrow
 * - (+|-) N (days|weeks|years)
 */
var relative_dates = {
  parseRelativeDate: function(date) {
    if (date === 'today') {
      return moment();
    }

    if (date === 'yesterday') {
      return moment().subtract(1, 'day');
    }

    if (date === 'tomorrow') {
      return moment().add(1, 'day');
    }

    // first, try moment and see if it works
    var parsedDate = moment(date);
    if (parsedDate.isValid()) {
      return parsedDate;
    }

    if (/^([-+]?\d+)$/.test(date) || /^([-+]?\d+) days?$/.test(date)) {
      date = date.replace(' days', '').replace(' day', '');
      var days = parseInt(date, 10);
      if (days < 0) {
        return moment().subtract(Math.abs(days), 'days');
      }
      return moment().add(Math.abs(days), 'days');
    }
    else if (/^([-+]?\d+) (week|weeks|year|years)$/.test(date)) {
      var result = /^([-+]?\d+) (week|weeks|year|years)$/.exec(date);
      var length = parseInt(result[1], 10);
      if (length < 0) {
        return moment().subtract(Math.abs(length), result[2]);
      }
      return moment().add(length, result[2]);
    }

    // couldn't figure out anything, return the invalid date
    return parsedDate;
  }
};
module.exports = relative_dates;
