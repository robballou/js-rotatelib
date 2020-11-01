import { AfterCriteria } from './criteria/after.mjs';
import { BaseCriteria } from './criteria/base.mjs';
import { BeforeCriteria } from './criteria/before.mjs';
import { DayCriteria } from './criteria/day.mjs';
import { ExceptDayCriteria } from './criteria/except_day.mjs';
import { ExceptHourCriteria } from './criteria/except_hour.mjs';
import { ExceptStartswithCriteria } from './criteria/except_startswith.mjs';
import { ExceptYearCriteria } from './criteria/except_year.mjs';
import { HasDateCriteria } from './criteria/has_date.mjs';
import { HourCriteria } from './criteria/hour.mjs';
import { IsArchiveCriteria } from './criteria/is_archive.mjs';
import { PatternCriteria } from './criteria/pattern.mjs';
import { StartswithCriteria } from './criteria/startswith.mjs';
import { YearCriteria } from './criteria/year.mjs';

export const criteria = {
    default: new BaseCriteria(),
    after: new AfterCriteria(),
    before: new BeforeCriteria(),
    day: new DayCriteria(),
    except_day: new ExceptDayCriteria(),
    has_date: new HasDateCriteria(),
    hour: new HourCriteria(),
    is_archive: new IsArchiveCriteria(),
    except_hour: new ExceptHourCriteria(),
    startswith: new StartswithCriteria(),
    except_startswith: new ExceptStartswithCriteria(),
    year: new YearCriteria(),
    except_year: new ExceptYearCriteria(),
    pattern: new PatternCriteria(),
};
