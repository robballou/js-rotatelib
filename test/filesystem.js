var should = require('should'),
  fs = require('fs'),
  path = require('path'),
  rimraf = require('rimraf'),
  rotatelib = require('../index.js'),
  handler = require('../lib/handlers/filesystem.js');

describe('FilesystemHandler', function() {
  it('applies', function() {
    new handler().applies({directory: 'something'}).should.be.ok;
  });

  describe('list()', function() {
    var testDirectory = 'fstestdir';

    beforeEach(function() {
      fs.mkdirSync(testDirectory);

      // create some files
      var fd = fs.openSync(path.join(testDirectory, 'test.txt'), 'w');
      fs.writeSync(fd, 'Hello!');
      fs.closeSync(fd);

      // create some more files
      var fd2 = fs.openSync(path.join(testDirectory, 'test2015-01-01.txt'), 'w');
      fs.writeSync(fd2, 'Hello!');
      fs.closeSync(fd2);
    });

    afterEach(function() {
      rimraf.sync(testDirectory);
    });

    it('returns files in directory', function(done) {
      fs.existsSync(path.join(testDirectory, 'test.txt')).should.be.ok;
      rotatelib.list({
        directory: testDirectory
      })
        .once('done', function(items) {
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
        .once('done', function(items) {
          items.should.have.length(1);
          items.should.containEql('test2015-01-01.txt');
          done();
        });
    });
  });
});
