import { BaseCriteria } from './base.mjs';

/**
 * StartswithCriteria
 *
 * Tests if the item is not from the specified hour.
 */
export class StartswithCriteria extends BaseCriteria {
    applies(params) {
        return 'startswith' in params;
    }

    matches(item, params) {
        if (!Array.isArray(params.startswith)) {
            params.startswith = [params.startswith];
        }

        for (var i=0, c=params.startswith.length; i < c; i++) {
            if (item.substr(0, params.startswith[i].length) === params.startswith[i]) {
                return 1;
            }
        }
        return 0;
    }

    option(program) {
        program.option('--startswith <string>', 'Select items that start with this string');
        return 'startswith';
    }
}
