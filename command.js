#!/usr/bin/env node
var program = require('commander');
var path = require('path');
var rotatelib = require('./index.js');
var filters = require('./lib/filters.js');
var criteria = require('./lib/criteria.js');
var inquirer = require('inquirer');

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
      var option = criteria[criteriaItem].option(program);
      items[option] = criteriaItem;
    }
  }
}

// register filter options
for (var filterItem in filters) {
  if (filters.hasOwnProperty(filterItem) && filterItem[0] != '_' && filterItem != 'default') {
    if (typeof filters[filterItem].option === 'function') {
      var option = filters[filterItem].option(program);
      items[option] = filterItem;
    }
  }
}

// actions
program
  .option('--remove', 'Remove matched items, prompts by default')
  .option('--no-prompt', 'Do not prompt, assume yes', false);

program.parse(process.argv);
if (program.args.length != 1) {
  program.outputHelp();
  return;
}

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
      if (items.length === 0 && program.prompt) {
        console.log('No items matched, nothing removed');
        return;
      }

      if (!program.prompt) {
        rotatelib.removeItems(items, params);
        return;
      }
      console.log('Matched items:');
      console.log(items.join('\n'));
      inquirer.prompt({
        name: 'confirm',
        type: 'confirm',
        message: 'Do you want to remove these items?'
      }, function(input) {
        if (input.confirm) {
          rotatelib.removeItems(items, params);
        }
        else {
          console.log('No items removed');
        }
      });
      return;
    }

    // list out the items
    items.forEach(function(item) {
      console.log(path.join(params.directory, item));
    });
  });
