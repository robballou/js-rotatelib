#!/usr/bin/env node

import inquirer from 'inquirer';
import path from 'path';

import program from 'commander';

import { Rotatelib } from './index.js';

import { criteria } from './lib/criteria.mjs';
import { filters } from './lib/filters.mjs';

program.version('0.0.1');

const items = {};
const rotatelib = new Rotatelib();

// register criteria options
for (var criteriaItem in criteria) {
    if (Object.prototype.hasOwnProperty.call(criteria, criteriaItem) && criteriaItem[0] != '_' && criteriaItem != 'default') {
        if (typeof criteria[criteriaItem].option === 'function') {
            const option = criteria[criteriaItem].option(program);
            items[option] = criteriaItem;
        }
    }
}

// register filter options
for (var filterItem in filters) {
    if (Object.prototype.hasOwnProperty.call(filters, filterItem) && filterItem[0] != '_' && filterItem != 'default') {
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
    process.exit(1);
}

var params = {
    directory: program.args[0],
};
for (var item in items) {
    if (Object.prototype.hasOwnProperty.call(items, item)) {
        if (Object.prototype.hasOwnProperty.call(program, item)) {
            params[items[item]] = program[item];
        }
    }
}

rotatelib.list(params)
    .then((rotateItems) => {
        if (program.remove) {
            if (rotateItems.length === 0 && program.prompt) {
                console.log('No items matched, nothing removed');
                return;
            }

            if (!program.prompt) {
                rotatelib.removeItems(rotateItems, params);
                return;
            }
            console.log('Matched items:');
            console.log(rotateItems.join('\n'));
            inquirer.prompt({
                name: 'confirm',
                type: 'confirm',
                message: 'Do you want to remove these items?',
            }, (input) => {
                if (input.confirm) {
                    rotatelib.removeItems(rotateItems, params);
                }
                else {
                    console.log('No items removed');
                }
            });
            return;
        }

        // list out the items
        items.forEach((rotateItem) => {
            console.log(path.join(params.directory, rotateItem));
        });
    });
