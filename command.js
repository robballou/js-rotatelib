#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2)),
  path = require('path'),
  rotatelib = require('./index.js')

var params = {};

for (var property in argv) {
  if (property.substr(0, 1) !== '_') {
    var new_property = property.replace('-', '_');
    params[new_property] = argv[property];
  }
}

if (argv._.length) {
  params.directory = argv._.shift();
}
else {
  console.log('No directory specified');
  process.exit(1);
}

rotatelib
  .list(params)
  .then(function(items) {
    items.forEach(function(item) {
      console.log(path.join(params.directory, item));
    });
  });
