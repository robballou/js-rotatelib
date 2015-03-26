#!/usr/bin/env node
var program = require('commander');
var path = require('path');
var rotatelib = require('./index.js');
var filters = require('./lib/filters.js');
var criteria = require('./lib/criteria.js');

function camelcase(flag) {
  return flag.split('-').reduce(function(str, word) {
    return str + word[0].toUpperCase() + word.slice(1);
  });
}

program.version('0.0.1');

var items = {};

// register criteria options
for (var criteriaItem in criteria) {
  if (criteria.hasOwnProperty(criteriaItem) && criteriaItem[0] != '_' && criteriaItem != 'default') {
    if (typeof criteria[criteriaItem].option === 'function') {
      criteria[criteriaItem].option(program);
      items[camelcase(criteriaItem.replace('_', '-'))] = criteriaItem;
    }
  }
}

// register filter options
for (var filterItem in filters) {
  if (filters.hasOwnProperty(filterItem) && filterItem[0] != '_' && filterItem != 'default') {
    if (typeof filters[filterItem].option === 'function') {
      filters[filterItem].option(program);
      items[camelcase(filterItem.replace('_', '-'))] = filterItem;
    }
  }
}

// actions
program
  .option('--remove', 'Remove matched items');

program.parse(process.argv);

var params = {
  directory: program.args[0]
};

for (var item in items) {
  if (items.hasOwnProperty(item)) {
    if (program.hasOwnProperty(item)) {
      params[items[item]] = program[item];
    }
  }
}
rotatelib
  .list(params)
  .then(function(items) {
    if (program.remove) {
      rotatelib.removeItems(items, params);
      return;
    }
    items.forEach(function(item) {
      console.log(path.join(params.directory, item));
    });
  });
