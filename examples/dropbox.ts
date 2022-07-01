/*

This script will connect to Dropbox (more below) and move some files from one location to another.

*/

import dotenv from 'dotenv';
import { Rotatelib } from '../src/rotatelib';
import { HandlerBase } from '../src/lib/handlers/HandlerBase';
import { RotateItem, DirectoryParams, ListItem, Action } from '../src/types';
import { Dropbox } from 'dropbox';
import type { files } from 'dropbox';

dotenv.config();

class DropboxItem implements ListItem {
	protected data: files.FileMetadataReference;

	constructor(dropbox: files.FileMetadataReference ) {
		this.data = dropbox;
	}

	toString() {
		return this.data.path_display || this.data.name;
	}
}

type DestinationHandler = {
	(item: RotateItem): string
}

type DropboxHandlerActionConfig = Record<string,unknown> & {
	destination: DestinationHandler
};

class DropboxHandler extends HandlerBase {
	async action(action: Action, items: RotateItem[], actionConfig: DropboxHandlerActionConfig): Promise<boolean> {
		if (action === 'move') {
			const batch: files.RelocationPath[] = items.map((item) => {
				return {
					from_path: item.toString(),
					to_path: actionConfig.destination(item)
				};
			});
			const dropbox = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN });
			const response = await dropbox.filesMoveBatchV2({
				entries: batch
			});
			console.log(response);
			return true;
		}
		return false;
	}

	applies(params: Partial<DirectoryParams>): boolean {
		return Boolean('directory' in params && params.directory);
	}

	async list(params: Partial<DirectoryParams>): Promise<RotateItem[]> {
		if (params.directory) {
			const dropbox = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN });
			const response = await dropbox.filesListFolder({
				path: params.directory
			});
			const items = response.result.entries
				.filter(this.isFile)
				.map((entry) => new DropboxItem(entry));
			return items;
		}

		return [];
	}

	isFile(entry: files.FileMetadataReference | files.FolderMetadataReference | files.DeletedMetadataReference): entry is files.FileMetadataReference  {
		return entry['.tag'] === 'file';
	}
}

async function main() {
	if (!('DROPBOX_TOKEN' in process.env)) {
		console.error('Missing DROPBOX_TOKEN');
		process.exit(1);
	}

	const rotatelib = new Rotatelib({
		handlers: [new DropboxHandler()]
	});

	const params = {
		directory: '/Photos',
		year: 2020
	};

	// get all items where the year is 2020 in the dropbox path '/Photos'
	const items = await rotatelib.list(params);

	// move all these items to '/Photos/2020' (this starts an async job
	// within dropbox so the script finishes running before the job does)
	await rotatelib.action('move', items, params, {
		destination: (item: RotateItem) => {
			return item.toString().replace('/Photos', '/Photos/2020');
		}
	});
}

main();
