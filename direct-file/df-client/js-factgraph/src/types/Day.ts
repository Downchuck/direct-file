import { parseISO, formatISO, subDays, getYear, getMonth, getDate } from 'date-fns';

export class Day {
  constructor(public date: Date) {}

  static fromString(s: string): Day | undefined {
    try {
      const date = parseISO(s);
      return new Day(date);
    } catch (e) {
      return undefined;
    }
  }

  static fromOptionalString(s?: string): Day | undefined {
    if (!s) {
      return undefined;
    }
    return Day.fromString(s);
  }

  get year(): number {
    return getYear(this.date);
  }

  get month(): number {
    return getMonth(this.date) + 1; // date-fns months are 0-indexed
  }

  get day(): number {
    return getDate(this.date);
  }

  toString(): string {
    return formatISO(this.date, { representation: 'date' });
  }

  isBefore(other: Day): boolean {
    return this.date < other.date;
  }

  isAfter(other: Day): boolean {
    return this.date > other.date;
  }

  isSameOrBefore(other: Day): boolean {
    return this.date <= other.date;
  }

  isSameOrAfter(other: Day): boolean {
    return this.date >= other.date;
  }

  minus(days: Days): Day {
    return new Day(subDays(this.date, days.value));
  }
}

export class Days {
    constructor(public value: number) {}
}
