import { Injectable } from '@angular/core';
import { default as ExpressionDescriptor } from 'cronstrue';

export enum Period {
  Secondly = 'Secondly',
  Minutely = 'Minutely',
  Hourly = 'Hourly',
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Yearly = 'Yearly',
  Custom = 'Custom'
}

export enum Weekday {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday
}

export enum Month {
  January,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December
}

export interface ICronData {
  expression?: string;
  period: Period;
  description: string;
  isQuartz: boolean;
  valid: boolean;

  seconds?: number;
  secondInterval?: number;
  minute?: number;
  minuteInterval?: number;
  hour?: number;
  day?: number;
  month?: keyof typeof Month;
  daysMax?: number;
  time?: Date;
  weekday?: keyof typeof Weekday;
}

// @dynamic
@Injectable()
export class NgxCronService {
  static DOWS = Array.from({ length: 7 }, (_, i) => Weekday[i]) as Array<keyof typeof Weekday>;
  static MONTHS = Array.from({ length: 12 }, (_, i) => Month[i]) as Array<keyof typeof Month>;

  static PERIODS = {
    Secondly: {
      cron: '* * * * * *',
      regex: /^\*(\/\d+)?(\s\*){5}$/,
      quartz: true
    },
    Minutely: {
      cron: '* * * * *',
      regex: /^\*(\/\d+)?(\s\*){4}$/,
      quartz: false
    },
    Hourly: {
      cron: '0 * * * *',
      regex: /^\d+\s(\*\s){3}\*$/,
      quartz: false
    },
    Daily: {
      cron: '0 0 * * *',
      regex: /^(\d{1,2}\s){2,3}(\*\s){2}\*$/,
      quartz: false
    },
    Weekly: {
      cron: '0 0 * * 0',
      regex: /^(\d{1,2}\s){2,3}(\*\s){2}\d{1,2}$/,
      quartz: false
    },
    Monthly: {
      cron: '0 0 1 * *',
      regex: /^(\d+\s){3,4}\*\s\*$/,
      quartz: false
    },
    Yearly: { cron: '0 0 1 1 *', regex: /^(\d+\s){4,5}\*$/, quartz: false },
    Custom: { cron: '* * * * *', regex: /^.*$/, quartz: false }
  };

  static PERIODKEYS = Object.keys(Period) as Period[];

  static MIDNIGHT = new Date(1990, 1, 1, 0, 0);

  private expressionDescriptorOptions = {
    locale: 'en',
    throwExceptionOnParseError: true
  };

  toString(cron: string) {
    const e: any = new ExpressionDescriptor(cron, this.expressionDescriptorOptions);

    try {
      return e.getFullDescription();
    } catch (err) {
      return err || e.i18n.anErrorOccuredWhenGeneratingTheExpressionD();
    }
  }

  getCronData(cron: string, period: Period): ICronData {
    const e: any = new ExpressionDescriptor(cron, this.expressionDescriptorOptions);

    let data: ICronData;

    try {
      data = {
        description: e.getFullDescription(),
        period: period === Period.Custom ? Period.Custom : this.getPeriod(e.expression),
        valid: true,
        isQuartz: e.expressionParts[0] !== ''
      };
    } catch (err) {
      return {
        description: err || e.i18n.anErrorOccuredWhenGeneratingTheExpressionD(),
        period: Period.Custom,
        valid: false,
        isQuartz: false
      };
    }

    data.seconds = this.getSeconds(e.expressionParts);
    data.secondInterval = this.getSecondInterval(e.expressionParts);
    data.minute = this.getMin(e.expressionParts);
    data.minuteInterval = this.getMinInterval(e.expressionParts);
    data.hour = this.getHour(e.expressionParts);
    data.day = this.getDay(e.expressionParts);
    data.month = this.getMonth(e.expressionParts);
    data.weekday = this.getDow(e.expressionParts);
    data.daysMax = this.getDaysMax(e.expressionParts);
    data.time = this.getTime(e.expressionParts);
    data.isQuartz = e.expressionParts[0] !== '';
    data.valid = this.validate(data);

    if (!data.valid) {
      data.description = `${data.description} - Invalid expression`;
    }

    return data;
  }

  getCronFromCronData(cron: ICronData): string {
    let r: Array<string | number> = ['', '*', '*', '*', '*', '*'];
    let [seconds, min, hour, day, month, dow]: Array<string | number> = r;
    switch (cron.period) {
      case 'Secondly':
        seconds = cron.secondInterval === 1 ? '*' : `*/${cron.secondInterval}`;
        break;
      case 'Minutely':
        if (+cron.minuteInterval !== 1) {
          min = `*/${cron.minuteInterval}`;
        }
        break;
      case 'Hourly':
        if (cron.minute == null) {
          cron.minute = 0;
        }
        min = cron.minute;
        break;
      case 'Weekly':
        dow = Weekday[cron.weekday];
      case 'Daily':
        cron.time = cron.time || NgxCronService.MIDNIGHT;
        min = cron.time.getMinutes();
        hour = cron.time.getHours();
        break;
      case 'Yearly':
        month = Month[cron.month] + 1;
        if (cron.month === undefined) {
          month = Month.January;
        }
      case 'Monthly':
        min = cron.time.getMinutes();
        hour = cron.time.getHours();
        if (cron.day == null) {
          cron.day = 0;
        }
        day = cron.day;
        break;
      default:
        return cron.expression;
    }
    r = [min, hour, day, month, dow];
    if (seconds) {
      r.unshift(seconds);
    }
    return r.join(' ');
  }

  private validate(data: any): boolean {
    if (data.min || data.minuteInterval > 59 || data.minuteInterval === 0) {
      return false;
    }
    if (data.hour > 24) {
      return false;
    }

    if (data.secondInterval > 59 || data.secondInterval === 0) {
      return false;
    }

    if (data.minute > 59) {
      return false;
    }

    if (data.weekday === undefined) {
      return false;
    }

    if (data.month === undefined) {
      return false;
    }

    const daysMax = data.daysMax;
    if ((daysMax !== null && data.day > daysMax) || data.day > 31 || data.day === 0) {
      return false;
    }
    return true;
  }

  private getPeriod(expression: string): Period {
    for (const [key, value] of (Object as any).entries(NgxCronService.PERIODS)) {
      if (value.regex.test(expression)) {
        return key;
      }
    }
    return Period.Custom;
  }

  private getSeconds(expressionParts: string[]): number {
    const v = this.getSegment(expressionParts[0])[0][0];
    return typeof v === 'number' ? v : null;
  }

  private getSecondInterval(expressionParts: string[]): number {
    const v = this.getSegment(expressionParts[0])[0][1];
    return typeof v === 'number' ? v : null;
  }

  private getMin(expressionParts: string[]): number {
    const v = this.getSegment(expressionParts[1])[0][0];
    return typeof v === 'number' ? v : null;
  }

  private getMinInterval(expressionParts: string[]): number {
    const v = this.getSegment(expressionParts[1])[0][1];
    return typeof v === 'number' ? v : null;
  }

  private getHour(expressionParts: string[]): number {
    const v = this.getSegment(expressionParts[2])[0][0];
    return typeof v === 'number' ? v : null;
  }

  private getDay(expressionParts: string[]): number {
    const v = this.getSegment(expressionParts[3])[0][0];
    return typeof v === 'number' ? v : null;
  }

  private getTime(expressionParts: string[]): Date {
    const s = this.getSeconds(expressionParts);
    const h = this.getHour(expressionParts);
    const m = this.getMin(expressionParts);
    return typeof h === 'number' && typeof m === 'number' ? new Date(1990, 1, 1, h, m, s || 0) : null;
  }

  private getMonth(expressionParts: string[]): keyof typeof Month {
    const v = this.getSegment(expressionParts[4])[0][0];
    return typeof v === 'number' ? (Month[v - 1] as keyof typeof Month) : null;
  }

  private getDaysMax(expressionParts: string[]): number {
    const v = this.getSegment(expressionParts[4])[0][0];
    return typeof v === 'number' ? new Date(2008, v, 0).getDate() : null;
  }

  private getDow(expressionParts: string[]): keyof typeof Weekday {
    const v = this.getSegment(expressionParts[5])[0][0];

    return typeof v === 'number' ? (Weekday[v] as keyof typeof Weekday) : null;
  }

  private getSegment(value: string): Array<Array<string | number>> {
    if (value === undefined) {
      value = '*';
    }
    return value.split(',').map(s => {
      if (s === undefined) {
        s = '*';
      }
      return s.split('/').map(p => {
        const v = parseInt(p, 10);
        return isNaN(v) ? p : v;
      });
    });
  }
}
