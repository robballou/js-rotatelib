// import should from 'should';
// import shouldPromised from 'should-promised';

import chai from 'chai';
import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import util from 'util';

import { Rotatelib } from '../index.js';
import { FilesystemHandler as handler } from '../lib/handlers/filesystem.mjs';

chai.should();

const openPromise = util.promisify(fs.open);
const writePromise = util.promisify(fs.write);
const closePromise = util.promisify(fs.close);
const mkdtempPromise = util.promisify(fs.mkdtemp);
const readdirPromise = util.promisify(fs.readdir);
const rimrafPromise = util.promisify(rimraf);

//
// Create a file
//
async function createFile(filename, contents) {
    // create some files
    const fd = await openPromise(filename, 'w');
    await writePromise(fd, contents);
    await closePromise(fd);
}

const rotatelib = new Rotatelib();

describe('FilesystemHandler', () => {

    it('applies', () => {
        // eslint-disable-next-line no-unused-expressions
        (new handler())
            .applies({ directory: 'something' })
            .should.be.ok;
    });

    describe('list()', () => {
        const testDirectory = 'fstestdir';
        let directory;

        beforeEach(async () => {
            directory = await mkdtempPromise(testDirectory);
            // create some files
            await createFile(path.join(directory, 'test.txt'), 'Hello!');
            await createFile(path.join(directory, 'test2015-01-01.txt'), 'Hello 2!');
        });

        afterEach(async () => {
            await rimrafPromise(directory);
        });

        it('returns files in directory', async () => {
            const items = await rotatelib.list({
                directory,
            })
            items.should.have.length(2);
        });

        it('uses criteria', async () => {
            const items = await rotatelib.list({
                directory,
                has_date: true,
            })
            items.should.have.length(1);
            items.should.contain('test2015-01-01.txt');
        });
    });

    describe('removeItems()', () => {
        const testDirectory = 'fstestdir';
        let directory;

        /**
        * Add a test directory and some files.
        */
        beforeEach(async () => {
            directory = await mkdtempPromise(testDirectory);

            // create some files
            await createFile(path.join(directory, 'test.txt'), 'Hello!');
            await createFile(path.join(directory, 'test2015-01-01.txt'), 'Hello 2!');
        });

        /**
        * Cleanup test directory.
        */
        afterEach(async () => {
            await rimrafPromise(directory);
        });

        it('does not remove files in test mode', async () => {
            var params = {
                directory,
                has_date: true,
                test: true,
            };

            // i think the problem is that the event is finished before the event
            // handler is added.
            var items = ['test2015-01-01.txt'];
            await rotatelib.removeItems(items, params)
            var files = await readdirPromise(directory);
            files.should.have.length(2);
        });

        it('remove files', async () => {
            var params = {
                directory,
                has_date: true,
            };

            // i think the problem is that the event is finished before the event
            // handler is added.
            var items = ['test2015-01-01.txt'];
            await rotatelib.removeItems(items, params);
            var files = await readdirPromise(directory);
            files.should.have.length(1);
            files.should.contain('test.txt');
        });
    });
});
