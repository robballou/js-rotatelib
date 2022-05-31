import type { Criteria } from './lib/criteria';
import type { HandlerBase } from './lib/handlers/HandlerBase';

export type CriteriaConfig = {
  archiveTypes: string[];
}

export type RotatelibConfig = Partial<{
  criteriaConfig: CriteriaConfig,
  criteria: Criteria,
  handlers: HandlerBase[],
}>;

export type ListItem = {
  toString(): string;
}

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
  debug: boolean;
}>;

export type DirectoryParams = Params & {
  directory: string;
}

export type ItemsParams = Params & {
  items: string[];
}

export type ListParams = ItemsParams | DirectoryParams;

export type FilesystemHandlerConfig = Partial<{
  ignoreHiddenItems: boolean
}>
