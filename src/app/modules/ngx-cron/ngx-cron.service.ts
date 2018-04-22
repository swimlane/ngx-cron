import { Injectable } from '@angular/core';
import { default as ExpressionDescriptor } from 'cronstrue';

export interface ICronData {
  expression?: string;
  period: string;
  description: string;
  isQuartz: boolean;
  valid: boolean;

  seconds?: number;
  secondInterval?: number;
  min?: number;
  minInterval?: number;
  hour?: number;
  day?: number;
  month?: string;
  daysMax?: number;
  time?: Date;
  dow?: string;
}

@Injectable()
export class CronService {
  static DOWS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  static MONTHS = ['January', 'February', 'March', 'April',
                'May', 'June', 'July', 'August',
                'September', 'October', 'November', 'December'];

  static PERIODS = {
    Secondly: {cron: '* * * * * *', regex: /^\*(\/\d+)?(\s\*){5}$/, quartz: true },
    Minutely: {cron: '* * * * *', regex: /^\*(\/\d+)?(\s\*){4}$/, quartz: false },
    Hourly: {cron: '0 * * * *', regex: /^\d{1,2}\s(\*\s){3}\*$/, quartz: false },
    Daily: {cron: '0 0 * * *', regex: /^(\d{1,2}\s){2,3}(\*\s){2}\*$/, quartz: false },
    Weekly: {cron: '0 0 * * 0', regex: /^(\d{1,2}\s){2,3}(\*\s){2}\d{1,2}$/, quartz: false },
    Monthly: {cron: '0 0 1 * *', regex: /^(\d{1,2}\s){3,4}\*\s\*$/, quartz: false },
    Yearly: {cron: '0 0 1 1 *', regex: /^(\d{1,2}\s){4,5}\*$/, quartz: false },
    Custom: {cron: '* * * * *', regex: /^.*$/, quartz: false }
  };

  static MIDNIGHT = new Date(1990, 1, 1, 0, 0);

  private expressionDescriptorOptions = {
    locale: 'en',
    throwExceptionOnParseError: true
  };

  toString(cron: string) {
    const e: any = new ExpressionDescriptor(
      cron, 
      this.expressionDescriptorOptions
    );

    try {
      return e.getFullDescription();
    } catch (err) {
      return err || e.i18n.anErrorOccuredWhenGeneratingTheExpressionD();
    }
  }

  getCronData(cron: string): ICronData {
    const e: any = new ExpressionDescriptor(
      cron, 
      this.expressionDescriptorOptions
    );

    let data: ICronData;

    try {
      data = {
        description: e.getFullDescription(),
        period: this.getPeriod(e.expression),
        valid: true,
        isQuartz: e.expressionParts[0] !== '',
      };
    } catch (err) {
      return { 
        description: err || e.i18n.anErrorOccuredWhenGeneratingTheExpressionD(),
        period: 'Custom',
        valid: false,
        isQuartz: false,
      };
    }

    data.seconds = this.getSeconds(e.expressionParts);
    data.secondInterval = this.getSecondInterval(e.expressionParts);
    data.min = this.getMin(e.expressionParts);
    data.minInterval = this.getMinInterval(e.expressionParts);
    data.hour = this.getHour(e.expressionParts);
    data.day = this.getDay(e.expressionParts);
    data.month = this.getMonth(e.expressionParts);
    data.daysMax = this.getDaysMax(e.expressionParts);
    data.time = this.getTime(e.expressionParts);
    data.isQuartz = e.expressionParts[0] !== '';
    data.valid = this.validate(data);

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
        if (+cron.minInterval !== 1) {
          min = `*/${cron.minInterval}`;
        }
        break;
      case 'Hourly':
        min = cron.min;
        break;
      case 'Weekly':
        dow  = CronService.DOWS.indexOf(cron.dow);
      case 'Daily':
        min  = cron.time.getMinutes();
        hour = cron.time.getHours();
        break;
      case 'Yearly':
        month = CronService.MONTHS.indexOf(cron.month) + 1;
      case 'Monthly':
        min  = cron.time.getMinutes();
        hour = cron.time.getHours();
        day  = cron.day;
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

  private validate(data: any) {
    if (data.min > 59) { return false; }
    if (data.hour > 24) { return false; }
    const daysMax = data.daysMax;
    if (daysMax !== null && data.day > daysMax) { return false; }
    return true;
  }

  private getPeriod(expression: string): string {
    for (const [key, value] of (Object as any).entries(CronService.PERIODS)) {
      if (value.regex.test(expression)) { return key; }
    }
    return 'Custom';
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
    return (typeof h === 'number' && typeof m === 'number') ? new Date(1990, 1, 1, h, m, s || 0) : null;
  }

  private getMonth(expressionParts: string[]): string {
    const v = this.getSegment(expressionParts[4])[0][0];
    return typeof v === 'number' ? CronService.MONTHS[v - 1] : null;
  }

  private getDaysMax(expressionParts: string[]): number {
    const v = this.getSegment(expressionParts[4])[0][0];
    return typeof v === 'number' ? new Date(2008, v, 0).getDate() : null;
  }

  private getDow(expressionParts: string[]): string {
    const v = this.getSegment(expressionParts[5])[0][0];
    return typeof v === 'number' ? CronService.DOWS[v] : null;
  }

  private getSegment(value: string) {
    if (value === undefined) { value = '*'; }
    return value.split(',').map(s => {
      if (s === undefined) { s = '*'; }
      return s.split('/').map(p => {
        const v = parseInt(p, 10);
        return isNaN(v) ? p : v;
      });
    });
  }
}
