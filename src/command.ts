import minimist from 'minimist';
import path from 'path';
import { Params } from './types';
import { Rotatelib } from './rotatelib';
import { FilesystemHandler } from './lib/handlers/FilesystemHandler';

function usage() {
  console.log('Usage: rotatelib');

  const flags = [
    'after',
    'before',
    'day|except-day',
    'has-date',
    'hour|except-hour',
    'is-archive',
    'pattern',
    'startswith|except-startswith',
    'year|except-year',
  ];

  flags.forEach((flag) => {
    console.log(`  [--${flag}=]`);
  });

  ['except-first', 'except-last'].forEach((flag) => {
    console.log(`  [--${flag}]`);
  });

  console.log('  [directory]');
}

function argsToParams(args: minimist.ParsedArgs) {
  const params: Partial<Params> = {};

  if (args.after) {
    params.after = args.after;
  }

  if (args.before) {
    params.before = args.before;
  }

  if (args.day) {
    params.day = args.day;
  }
  if (args['except-day']) {
    params.exceptDay = args['except-day'];
  }

  if (args.hour) {
    params.hour = args.hour;
  }
  if (args['except-hour']) {
    params.exceptHour = args['except-hour'];
  }

  if (args['is-archive']) {
    params.isArchive = args.isArchive;
  }

  if (args.pattern) {
    params.pattern = args.pattern;
  }

  if (args.startswith) {
    params.startsWith = args.startswith;
  }
  if (args['except-startswith']) {
    params.exceptStartsWith = args['except-startswith'];
  }

  if (args.year) {
    params.year = args.year;
  }
  if (args['except-year']) {
    params.exceptYear = args['except-year'];
  }

  if (args['except-first']) {
    params.exceptFirst = args['except-first'];
  }
  if (args['except-last']) {
    params.exceptLast = args['except-last'];
  }
  return params;
}

async function listItems(params: Partial<Params>, directory: string) {
  const resolvedPath = path.resolve(directory);

  const thisParams = {
    ...params,
    directory: resolvedPath
  };

  const rotatelib = new Rotatelib({
    handlers: [new FilesystemHandler()]
  });
  const items = await rotatelib.list(thisParams);
  console.log(items);
}

function main(args: minimist.ParsedArgs) {
  if (args._.length === 0) {
    return usage();
  }

  const params = argsToParams(args);

  args._.forEach((directory) => {
    listItems(params, directory);
  });
}

main(minimist(process.argv.slice(2)));
