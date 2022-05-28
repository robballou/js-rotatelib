import type { Criteria } from './lib/criteria';

export type CriteriaConfig = {
  archiveTypes: string[];
}

export type RotatelibConfig = Partial<{
  criteriaConfig: CriteriaConfig,
  criteria: Criteria,
}>;

// export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }
export type WithRequired<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> & Required<Pick<T, K>>
export type Criterion = {
  after: string;
  before: string;
  day: number | number[];
  exceptDay: number | number[];
  exceptHour: number | number[];
  exceptStartsWith: string | string[];
  exceptYear: number | number[];
  hasDate: boolean;
  hour: number | number[];
  isArchive: boolean;
  startsWith: string | string[];
  pattern: RegExp;
  year: number | number[];
}

export type CriterionName = keyof Criterion;
export type NormalCriterionName = Exclude<CriterionName, 'exceptDay' | 'exceptHour' | 'exceptStartsWith' | 'exceptYear'>;

export type Filters = {
  exceptFirst: 'day' | 'month';
  exceptLast: 'day' | 'month';
}

export type FilterName = keyof Filters;

export type Params = Partial<Criterion> & Partial<Filters> & Partial<{
  directory: string;
  items: any[];
  debug: boolean;
}>;
