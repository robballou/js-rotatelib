import { Rotatelib } from './rotatelib';
import { join as joinPath } from 'path';
import { FilesystemHandler } from './lib/handlers/FilesystemHandler';

describe('Rotatelib', () => {
	test('lists items that match criteria', async () => {
		const r = new Rotatelib();
		const result = await r.list({ hasDate: true, items: ['test2022-05-28', 'test'] });
		expect(result).toHaveLength(1);
	});

	test('list items in the filesystem', async () => {
		const r = new Rotatelib();
		r.addHandler(new FilesystemHandler());
		const result = await r.list({ hasDate: true, directory: joinPath(__dirname, 'test/fixtures/filesystem1') });
		expect(result).toHaveLength(3);
	});

	test('list items in the filesystem with hidden files', async () => {
		const r = new Rotatelib();
		r.addHandler(new FilesystemHandler({ ignoreHiddenItems: false }));
		const result = await r.list({ hasDate: true, directory: joinPath(__dirname, 'test/fixtures/filesystem1') });
		expect(result).toHaveLength(4);
	});

	test('list items in the filesystem filtered', async () => {
		const r = new Rotatelib({ handlers: [new FilesystemHandler()]});
		const result = await r.list({ exceptFirst: 'month', directory: joinPath(__dirname, 'test/fixtures/filesystem1') });
		expect(result).toHaveLength(2);
	});
});
