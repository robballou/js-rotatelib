import { CriterionBase } from './CriterionBase';
import type { CriteriaConfig, Criterion } from '../../types';
import { Criteria } from '../criteria';

type IsArchiveParams = Pick<Criterion, 'isArchive'>;

export class IsArchiveCriterion extends CriterionBase {
  protected archiveTypes = ['.gz',
    '.bz2',
    '.tgz',
    '.tbz2',
    '.zip'];

  constructor(parent: Criteria, config: Partial<CriteriaConfig>) {
    super(parent);

    if (config.archiveTypes) {
      this.archiveTypes = config.archiveTypes;
    }
  }

  testItem(params: IsArchiveParams, item: string): boolean {
    const result = this.archiveTypes.some((type) => item.endsWith(type));
    return result === params.isArchive;
  }
}
