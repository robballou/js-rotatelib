var should = require('should'),
  rotatelib = require('../index.js');

console.log(rotatelib);

describe('rotatelib', function() {
  describe('filesystem', function() {
    it('list() returns files with a date in their name', function() {
      var items = rotatelib.list({
        items: [
          'example.txt',
          'README.md',
          'file20141231.txt',
          'file2014.txt'
        ]
      });

      items.should.have.length(2);
      items.should.containEql('file20141231.txt');
      items.should.containEql('file2014.txt');
    });
  });
});
