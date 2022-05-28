import { DateTime } from 'luxon';
import { parseDateFromString } from './parse';

describe('parse', () => {
  test.each([
    ['fake', null],
    ['2022-05-21', DateTime.fromISO('2022-05-21')],
    ['2022-05-21.txt', DateTime.fromISO('2022-05-21')],
    ['test2022-05-21.txt', DateTime.fromISO('2022-05-21')],
    ['file20141231013000.txt', DateTime.fromISO('2014-12-31T01:30:00')],
  ])('parseDateFromString() parses %s', (input, expected) => {
    const result = parseDateFromString(input);
    if (expected === null) {
      expect(result).toBe(null);
    }
    else {
      expect(result).not.toBe(null);
      expect(result?.isValid).toBe(true);
      expect(result?.toISOTime()).toEqual(expected.toISOTime());
    }
  });
});
