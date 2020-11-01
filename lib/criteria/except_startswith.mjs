import { BaseCriteria } from './base.mjs';

/**
 * ExceptStartswithCriteria
 *
 * Tests if the item is not from the specified hour.
 */
export class ExceptStartswithCriteria extends BaseCriteria {
    applies(params) {
        return 'except_startswith' in params;
    }

    matches(item, params) {
        if (!Array.isArray(params.except_startswith)) {
            params.except_startswith = [params.except_startswith];
        }

        for (var i=0, c=params.except_startswith.length; i < c; i++) {
            if (item.substr(0, params.except_startswith[i].length) === params.except_startswith[i]) {
                return 0;
            }
        }
        return 1;
    }

    option(program) {
        program.option('--except-startswith <string>', 'Select items that do not start with this string');
        return 'exceptStartswith';
    }
}
