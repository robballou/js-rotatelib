import { DateTime } from 'luxon';
import { parseDateFromString } from '../parse';

class DateService {
  protected itemDatesParsed: Map<string, DateTime | null> = new Map();

  hasDate(item: string) {
    let parsed: DateTime | null = null;

    // if this is a string, just test against it
    if (typeof item === 'string') {
      parsed = this.parseDate(item);
    }

    if (parsed) {
      return parsed;
    }

    return false;
  }

  parseDate(item: string): DateTime | null {
    if (!this.itemDatesParsed.has(item)) {
      this.itemDatesParsed.set(item, parseDateFromString(item));
    }
    const result = this.itemDatesParsed.get(item);
    if (!result) {
      return null;
    }
    return result;
  }

  reset() {
    this.itemDatesParsed.clear();
  }
}

export const dateService = new DateService();