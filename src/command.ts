import minimist from 'minimist';

function usage() {
  console.log('Usage: rotatelib');

  const flags = [
    'after',
    'before',
    'day',
    'except-day',
    'has-date',
    'hour',
    'except-hour',
    'is-archive',
    'pattern',
    'startswith',
    'except-startswith',
    'year',
    'except-year',
  ];

  flags.forEach((flag) => {
    console.log(`  [--${flag}]`);
  });

  console.log('  [directory]');
}

function main(args: minimist.ParsedArgs) {
  if (args._.length === 0) {
    return usage();
  }
}

main(minimist(process.argv.slice(2)));
