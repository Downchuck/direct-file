import { parseISO, formatISO, getYear, getMonth, getDate, subDays } from 'date-fns';
import { Days } from './Days';

export class Day {
  private readonly date: Date;

  constructor(date: Date) {
    this.date = date;
  }

  public static fromString(s: string): Day {
    return new Day(parseISO(s));
  }

  public static fromDate(date: Date): Day {
    return new Day(date);
  }

  public get year(): number {
    return getYear(this.date);
  }

  public get month(): number {
    return getMonth(this.date) + 1;
  }

  public get day(): number {
    return getDate(this.date);
  }

  public sub(days: Days): Day {
    return new Day(subDays(this.date, days.value));
  }

  public toString(): string {
    return formatISO(this.date, { representation: 'date' });
  }

  public toDate(): Date {
    return this.date;
  }

  public equals(other: Day): boolean {
    return this.date.getTime() === other.date.getTime();
  }
}
