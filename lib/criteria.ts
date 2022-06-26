/* eslint-disable no-case-declarations */
import { DateTime } from 'luxon';
import Debug from 'debug';
import type { Params, CriterionName } from '../types';
import { CriteriaConfig, NormalCriterionName } from '../types';
import { enableDebug } from './enableDebug';
import { AfterCriterion } from './criteria/AfterCriterion';
import { BeforeCriterion } from './criteria/BeforeCriterion';
import { CriterionBase } from './criteria/CriterionBase';
import { DayCriterion } from './criteria/DayCriterion';
import { IsArchiveCriterion } from './criteria/IsArchiveCriterion';
import { HasDateCriterion } from './criteria/HasDateCriterion';
import { HourCriterion } from './criteria/HourCriterion';
import { YearCriterion } from './criteria/YearCriterion';
import { StartsWithCriterion } from './criteria/StartsWithCriterion';
import { PatternCriterion } from './criteria/PatternCriterion';

export class Criteria {
  debug = Debug('rotatelib:Criteria');
  itemDatesParsed = new Map<string, DateTime|null>();

  /**
   * Internal map of a criterion name to it's concrete Criterion implementation.
   */
  protected criteria: Record<NormalCriterionName, CriterionBase>;

  /**
   * Map of "inverse" criteria (ex, exceptDay)
   *
   * Used to match an inverse criteria to it's implementation.
   */
  protected inverseCriteriaMap: Record<Exclude<CriterionName, NormalCriterionName>, NormalCriterionName>;

  constructor(config: Partial<CriteriaConfig> = {}) {
    this.criteria = {
      after: new AfterCriterion(this),
      before: new BeforeCriterion(this),
      day: new DayCriterion(this),
      isArchive: new IsArchiveCriterion(this, config),
      hasDate: new HasDateCriterion(this),
      hour: new HourCriterion(this),
      year: new YearCriterion(this),
      startsWith: new StartsWithCriterion(this),
      pattern: new PatternCriterion(this),
    };

    this.inverseCriteriaMap = {
      exceptDay: 'day',
      exceptYear: 'year',
      exceptStartsWith: 'startsWith',
      exceptHour: 'hour',
    };
  }

  /**
   * Test a filename to see if it matches the criteria
   */
  test(params: Params, item: string) {
    enableDebug(params);

    // some of the criteria require a date to work but
    // users may not add it themselves. If we have a date-based
    // criteria, force hasDate=true
    const criteriaThatNeedHasDate = ['day', 'exceptDay', 'hour', 'exceptHour', 'year', 'exceptYear', 'after', 'before'];
    if (!('hasDate' in params)) {
      for (let index = 0; index < criteriaThatNeedHasDate.length; index++) {
        const criterion = criteriaThatNeedHasDate[index];
        if (criterion in params) {
          params.hasDate = true;
          break;
        }
      }
    }

    const criteriaKeys = Object.keys(params)
      .filter(this.isCriterion.bind(this))
      .sort(this.sortCriteria);

    for (let index = 0; index < criteriaKeys.length; index++) {
      const key = criteriaKeys[index];
      this.debug(`testing ${item} with ${key}`, { normal: this.isNormalCriterion(key)});
      if (this.isNormalCriterion(key) && key in this.criteria) {
        const result = this.criteria[key].testItem(params, item);
        if (!result) {
          this.debug(`item failed check: ${key}`, item);
          return false;
        }
      }
      else if (!this.isNormalCriterion(key) && key in this.inverseCriteriaMap) {
        const normalKey = this.inverseCriteriaMap[key];
        const result = this.criteria[normalKey].testItemInverse(params, item);
        if (!result) {
          this.debug(`item failed inverse check: ${key}`, item);
          return false;
        }
      }
      else {
        this.debug('Key not found', key);
      }
    }
    return true;
  }

  protected isCriterion(key: CriterionName | string): key is CriterionName {
    return Object.keys(this.criteria).includes(key) || Object.keys(this.inverseCriteriaMap).includes(key);
  }

  protected isNormalCriterion(key: NormalCriterionName | string): key is NormalCriterionName {
    return key.startsWith('except') === false && ['debug', 'items', 'directory'].includes(key) === false;
  }

  /**
   * Sorts some criteria (hasDate, isArchive) higher than others
   *
   * hasDate & isArchive can help limit the set of items to test,
   * so they get moved first. They are considered "heavy".
   */
  sortCriteria(firstKey: CriterionName, secondKey: CriterionName) {
    const heavyKeys: CriterionName[] = ['hasDate', 'isArchive'];
    const isFirstHeavy = heavyKeys.includes(firstKey);
    const isSecondHeavy = heavyKeys.includes(secondKey);
    if (isFirstHeavy && !isSecondHeavy) {
      return -1;
    } else if (!isFirstHeavy && isSecondHeavy) {
      return 1;
    }

    // both keys are heavy or neither are...
    return firstKey.localeCompare(secondKey);
  }

}
