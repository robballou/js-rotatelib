import { Criteria } from './criteria';
import { CriterionName } from '../types';

describe('criteria', () => {
  test('should test all criteria', () => {
    const crit = new Criteria();
    expect(crit.test({
      hasDate: true,
      before: 'today',
    }, 'test2022-05-21')).toBe(true);
  });

  test('sortCriteria() should put heavy keys first', () => {
    const crit = new Criteria();
    const names: CriterionName[] = ['after', 'hasDate'];
    const someCriteria = (names).sort(crit.sortCriteria);
    expect(someCriteria[0]).toBe('hasDate');
    expect(someCriteria[1]).toBe('after');
  });

  test.each([
    ['example.txt', '2014-01-01', false],
    ['README.md', '2014-01-01', false],
    ['file20131231.txt', '2014-01-01', false],
    ['file20141231.txt', '2014-01-01', true],
    ['file20150101.txt', '2014-01-01', true],
  ])('after criterion work tests %s correctly with %s', (fileName, input, expectedResult) => {
    const crit = new Criteria();
    expect(crit.test({ after: input }, fileName)).toBe(expectedResult);
  });

  test.each([
    ['example.txt', '2014-01-01', false],
    ['README.md', '2014-01-01', false],
    ['file20131231.txt', '2014-01-01', true],
    ['file20141231.txt', '2014-01-01', false],
    ['file20150101.txt', '2014-01-01', false],
  ])('before criterion work tests %s correctly with %s', (fileName, input, expectedResult) => {
    const crit = new Criteria();
    expect(crit.test({ before: input }, fileName)).toBe(expectedResult);
  });

  test.each([
    ['file.txt', 1, false],
    ['file20131231.txt', 1, false],
    ['file20141231.txt', 31, true],
    ['file20150101.txt', [1,2], true],
    ['file20150101.txt', [1], true],
  ])('day criterion work tests %s correctly with %s', (fileName, input, expectedResult) => {
    const crit = new Criteria();
    expect(crit.test({ day: input }, fileName)).toBe(expectedResult);
  });

  test.each([
    ['file.txt', 1, false],
    ['file20131231.txt', 1, true],
    ['file20141231.txt', 31, false],
    ['file20150101.txt', [1,2], false],
    ['file20150101.txt', [1], false],
    ['file20150101.txt', [2], true],
  ])('exceptDay criterion work tests %s correctly with %s', (fileName, input, expectedResult) => {
    const crit = new Criteria();
    expect(crit.test({ exceptDay: input }, fileName)).toBe(expectedResult);
  });

  test.each([
    ['test.txt', true, false],
    ['test.zip', true, true],
    ['test.txt.bz2', true, true],
    ['test.txt.bz2', false, false],
    ['test.txt', false, true],
  ])('isArchive criterion works for %s with isArchive=%s', (fileName, input, expectedResult) => {
    const crit = new Criteria();
    expect(crit.test({ isArchive: input }, fileName )).toBe(expectedResult);
  });

  test.each([
    ['test.txt', true, false],
    ['test.txt', false, true],
    ['test2022-05-28.txt', true, true],
    ['test2022-05-28.txt', false, false],
  ])('hasDate criterion works for %s with hasDate=%s', (fileName, input, expectedResult) => {
    const crit = new Criteria();
    expect(crit.test({ hasDate: input }, fileName )).toBe(expectedResult);
  });

  test.each([
    ['test.txt', 1, false],
    ['test2022-05-28.txt', 1, false],
    ['file20141231013000.txt', 1, true],
    ['file20141231013000.txt', [1, 2], true],
    ['file20141231013000.txt', [3], false],
  ])('hour criterion works for %s with hour=%s', (fileName, input, expectedResult) => {
    const crit = new Criteria();
    expect(crit.test({ hour: input }, fileName )).toBe(expectedResult);
  });

  test.each([
    ['test.txt', 1, false],
    ['test2022-05-28.txt', 1, true],
    ['file20141231013000.txt', 1, false],
    ['file20141231013000.txt', [1, 2], false],
    ['file20141231013000.txt', [3], true],
  ])('exceptHour criterion works for %s with exceptHour=%s', (fileName, input, expectedResult) => {
    const crit = new Criteria();
    expect(crit.test({ exceptHour: input }, fileName )).toBe(expectedResult);
  });

  test.each([
    ['test.txt', 2022, false],
    ['test2022-05-28.txt', 2022, true],
    ['file20141231013000.txt', 2022, false],
    ['file20141231013000.txt', [2022, 2021], false],
    ['file20141231013000.txt', [2014], true],
  ])('year criterion works for %s with year=%s', (fileName, input, expectedResult) => {
    const crit = new Criteria();
    expect(crit.test({ year: input }, fileName )).toBe(expectedResult);
  });

  test.each([
    ['test.txt', 2022, false],
    ['test2022-05-28.txt', 2022, false],
    ['file20141231013000.txt', 2022, true],
    ['file20141231013000.txt', [2022, 2021], true],
    ['file20141231013000.txt', [2014], false],
  ])('exceptYear criterion works for %s with exceptYear=%s', (fileName, input, expectedResult) => {
    const crit = new Criteria();
    expect(crit.test({ exceptYear: input }, fileName )).toBe(expectedResult);
  });

  test.each([
    ['test.txt', 'test', true],
    ['test2022-05-28.txt', 'test', true],
    ['file20141231013000.txt', 'test', false],
  ])('startsWith criterion works for %s with startsWith=%s', (fileName, input, expectedResult) => {
    const crit = new Criteria();
    expect(crit.test({ startsWith: input }, fileName )).toBe(expectedResult);
  });

  test.each([
    ['test.txt', 'test', false],
    ['test2022-05-28.txt', 'test', false],
    ['file20141231013000.txt', 'test', true],
  ])('exceptStartsWith criterion works for %s with exceptStartsWith=%s', (fileName, input, expectedResult) => {
    const crit = new Criteria();
    expect(crit.test({ exceptStartsWith: input }, fileName )).toBe(expectedResult);
  });

  test.each([
    ['test.txt', /\d/, false],
    ['test2022-05-28.txt', /\d/, true],
  ])('pattern criterion works for %s with pattern=%s', (fileName, input, expectedResult) => {
    const crit = new Criteria();
    expect(crit.test({ pattern: input }, fileName )).toBe(expectedResult);
  });
});
