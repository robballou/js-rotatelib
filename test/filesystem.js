var should = require('should'),
  shouldPromised = require('should-promised'),
  fs = require('fs'),
  path = require('path'),
  rimraf = require('rimraf'),
  rotatelib = require('../index.js'),
  handler = require('../lib/handlers/filesystem.js');

/**
 * Create a file
 */
function createFile(filename, contents) {
  // create some files
  var fd = fs.openSync(filename, 'w');
  fs.writeSync(fd, contents);
  fs.closeSync(fd);
}

describe('FilesystemHandler', function() {
  it('applies', function() {
    new handler().applies({directory: 'something'}).should.be.ok;
  });

  describe('list()', function() {
    var testDirectory = 'fstestdir';

    beforeEach(function() {
      fs.mkdirSync(testDirectory);

      // create some files
      createFile(path.join(testDirectory, 'test.txt'), 'Hello!');
      createFile(path.join(testDirectory, 'test2015-01-01.txt'), 'Hello 2!');
    });

    afterEach(function() {
      rimraf.sync(testDirectory);
    });

    it('returns files in directory', function(done) {
      fs.existsSync(path.join(testDirectory, 'test.txt')).should.be.ok;
      rotatelib.list({
        directory: testDirectory
      })
      .then(function(items) {
        items.should.have.length(2);
        done();
      });
    });

    it('uses criteria', function(done) {
      fs.existsSync(path.join(testDirectory, 'test.txt')).should.be.ok;
      rotatelib.list({
        directory: testDirectory,
        has_date: true
      })
      .then(function(items) {
        items.should.have.length(1);
        items.should.containEql('test2015-01-01.txt');
        done();
      });
    });
  });

  describe('removeItems()', function() {
    var testDirectory = 'fstestdir';

    /**
     * Add a test directory and some files.
     */
    beforeEach(function() {
      fs.mkdirSync(testDirectory);

      // create some files
      createFile(path.join(testDirectory, 'test.txt'), 'Hello!');
      createFile(path.join(testDirectory, 'test2015-01-01.txt'), 'Hello 2!');
    });

    /**
     * Cleanup test directory.
     */
    afterEach(function() {
      rimraf.sync(testDirectory);
    });

    it('does not remove files in test mode', function(done) {
      var params = {
        directory: testDirectory,
        has_date: true,
        test: true,
      };

      // i think the problem is that the event is finished before the event
      // handler is added.
      var items = ['test2015-01-01.txt'];
      var handler = rotatelib
        .removeItems(items, params)
        .then(function() {
          var files = fs.readdirSync(testDirectory);
          files.should.have.length(2);
          done();
        }).done();
    });

    it('remove files', function(done) {
      var params = {
        directory: testDirectory,
        has_date: true
      };

      // i think the problem is that the event is finished before the event
      // handler is added.
      var items = ['test2015-01-01.txt'];
      rotatelib
        .removeItems(items, params)
        .should.be.fulfilled
        .then(function() {
          var files = fs.readdirSync(testDirectory);
          files.should.have.length(1);
          files.should.containEql('test.txt');
          done();
        }).done();
    });
  });
});
