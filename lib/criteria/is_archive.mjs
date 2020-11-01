// var util = require('util'),
//     path = require('path'),
//     BaseCriteria = require('./base.js');
import path from 'path';

import { BaseCriteria } from './base.mjs';

/**
 * IsArchiveCriteria
 *
 * Tests if the item is an archived file.
 */
export class IsArchiveCriteria extends BaseCriteria {
    applies(params) {
        return 'is_archive' in params;
    }

    matches(item, params) {
        var archives = [
            '.gz',
            '.bz2',
            '.tgz',
            '.tbz2',
            '.zip',
        ];
        if (archives.indexOf(path.extname(item)) >= 0) {
            if (params.is_archive) {
                return 1;
            }
            return 0;
        }

        if (params.is_archive) {
            return 0;
        }
        return 1;
    }

    option(program) {
        program.option('--is-archive <archive>', 'The item is an archive or not (true|false)', function(input) {
            if (input == 'true') {
                return true;
            }
            return false;
        });
        return 'isArchive';
    }
}
