import fs from 'fs';
import path from 'path';

import { promisify } from 'util';

import { BaseHandler } from './base.mjs';

const readdirPromise = promisify(fs.readdir);

export class FilesystemHandler extends BaseHandler {
    applies(params) {
        return 'directory' in params;
    }

    async list(params) {
        const self = this,
            directory = path.normalize(params.directory),
            applyCriteria = this.rotatelib.getApplicableCriteria(params),
            applyFilters = this.rotatelib.getApplicableFilters(params);

        const files = await readdirPromise(directory);

        var items = [];
        files.forEach((item) => {
            if (self.rotatelib.matchesCriteria(item, params, applyCriteria)) {
                items.push(item);
            }
        });

        if (applyFilters) {
            applyFilters.forEach((filter) => {
                items = filter.filter(items, params);
            });
        }

        return items;
    }

    removeItems(items, params) {
        const promises = items.map((item) => this.removeItem(item, params));
        return Promise.all(promises).then(items);
    }

    removeItem(item, params) {
        return new Promise((resolve) => {
            var itemPath = path.normalize(path.join(params.directory, item));

            // simulate removing the item
            if (!this.test(params)) {
                fs.unlink(itemPath, () => {
                    resolve(item, itemPath);
                });
            }
            else {
                resolve(item, itemPath);
            }
        });
    }
}
