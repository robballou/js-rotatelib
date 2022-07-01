import Debug from 'debug';
import { normalize as normalizePath, join as joinPath } from 'path';
import fs from 'fs/promises';
import { DirectoryParams, FilesystemHandlerConfig, RotateItem, FilesystemHandlerAction } from '../../types';
import { HandlerBase } from './HandlerBase';

/**
 * Handles listing and performing actions on a filesystem.
 *
 * Supported actions:
 * - remove
 */
export class FilesystemHandler extends HandlerBase {
	debug = Debug('rotatelib:FilesystemHandler');
	options: Required<FilesystemHandlerConfig> = {
		ignoreHiddenItems: true,
	};

	constructor(config: FilesystemHandlerConfig | null = null) {
		super();
		if (config) {
			this.options = {
				...this.options,
				...config,
			};
		}
	}

	async action(action: FilesystemHandlerAction, items: RotateItem[]): Promise<boolean> {
		if (action === 'remove') {
			const promises = items.map((item) => fs.unlink(typeof item !== 'string' ? item.toString() : item));
			await Promise.all(promises);
		}
		return true;
	}

	applies(params: Partial<DirectoryParams>): boolean {
		return 'directory' in params && !!params.directory;
	}

	/**
   * Return all items in the directory
   */
	async list(params: DirectoryParams): Promise<string[]> {
		if (!('directory' in params) || !params.directory) {
			this.debug('No directory specified, skipping finding items');
			return [];
		}

		const directory = normalizePath(params.directory);

		return await this.readDirectory(directory);
	}

	/**
   * Recursively read directories
   */
	async readDirectory(directory: string): Promise<string[]> {
		const items: string[] = [];

		try {
			const itemsInDirectory = await fs.readdir(directory);
			const promises: Promise<string[]>[] = [];
			itemsInDirectory.forEach((item) => {
				if ((this.options.ignoreHiddenItems && !item.startsWith('.')) || !this.options.ignoreHiddenItems) {
					const itemPath = joinPath(directory, item);
					items.push(itemPath);
					promises.push(this.readDirectory(itemPath));
				}
			});
			const children = await Promise.all(promises);
			children
				.filter((childItems) => childItems.length > 0)
				.flat()
				.forEach((item) => items.push(item));
		} catch (error) {
			this.debug('Could not read directory/item', directory);
		}

		return items;
	}
}
