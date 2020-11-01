import { ExceptFirstFilter } from './filters/except_first.mjs';
import { ExceptLastFilter } from './filters/except_last.mjs';

export const filters = {
    except_first: new ExceptFirstFilter(),
    except_last: new ExceptLastFilter(),
};
