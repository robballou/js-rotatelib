var moment = require('moment');
var relative_dates = {
  parseRelativeDate: function(date) {
    if (date === 'today') {
      return moment();
    }

    if (date === 'yesterday') {
      return moment().subtract(1, 'day');
    }

    // first, try moment and see if it works
    var parsedDate = moment(date);
    if (parsedDate.isValid()) {
      return parsedDate;
    }

    if (/^(-?\d+)$/.test(date) || /^(-?\d+) days?$/.test(date)) {
      date = date.replace(' days', '').replace(' day', '');
      var days = parseInt(date, 10);
      if (days < 0) {
        return moment().subtract(Math.abs(days), 'days');
      }
      return moment().add(Math.abs(days), 'days');
    }


    // couldn't figure out anything, return the invalid date
    console.log('Could not parse: ' + date);
    return parsedDate;
  }
};
module.exports = relative_dates;
