import { Injectable } from '@angular/core';
import cronstrue from 'cronstrue/i18n';
import CronValidate from 'cron-validate';
import moment from 'moment-timezone';

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
  time?: moment.Moment;
  weekday?: keyof typeof Weekday;
}

const MAX_MINUTES = 59;
const MAX_DAYS_OF_MONTH = 31;

function createCronstrueObject(expression: string, options) {
  if (cronstrue['default']) {
    return new cronstrue['default'](expression, options);
  } else {
    return new cronstrue(expression, options);
  }
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

  private cronValidateConfig = {
    preset: 'default',
    override: {
      useSeconds: false
    }
  };

  static CRON_VALIDATE_CONFIG_OVERRIDES = {
    useLastDayOfMonth: true,
    useLastDayOfWeek: true,
    useAliases: true,
    useNthWeekdayOfMonth: true,
    useNearestWeekday: true,
    useBlankDay: true
  };

  static PERIODKEYS = Object.keys(Period) as Period[];

  private expressionDescriptorOptions = {
    locale: 'en',
    throwExceptionOnParseError: true
  };

  private timezone = '';

  getMidnight() {
    return moment.tz([1990, 0, 1, 0, 0, 0], this.timezone);
  }

  toString(cron: string) {
    const e: any = createCronstrueObject(cron, this.expressionDescriptorOptions);

    try {
      return e.getFullDescription();
    } catch (err) {
      return err || e.i18n.anErrorOccuredWhenGeneratingTheExpressionD();
    }
  }

  getCronData(
    cron: string,
    period: Period,
    lang: string,
    configOverrides: typeof NgxCronService.CRON_VALIDATE_CONFIG_OVERRIDES
  ): ICronData {
    this.expressionDescriptorOptions.locale = lang || 'en';
    const e: any = createCronstrueObject(cron, this.expressionDescriptorOptions);

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
        description:
          this.validateCronExpression(cron, false, configOverrides)?.error ||
          e.i18n.anErrorOccuredWhenGeneratingTheExpressionD(),
        period: period === Period.Custom ? Period.Custom : this.getPeriod(e.expression),
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
    const { isValid, error } = this.validate(data, e.expression, configOverrides);
    data.valid = isValid;

    if (!data.valid) {
      data.description = error;
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
        cron.time = cron.time || this.getMidnight();
        min = cron.time.minutes();
        hour = cron.time.hours();
        break;
      case 'Yearly':
        month = Month[cron.month] + 1;
        if (cron.month === undefined) {
          month = Month.January;
        }
      case 'Monthly':
        min = cron.time.minutes();
        hour = cron.time.hours();
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

  setTimezone(timezone: string) {
    this.timezone = timezone;
  }

  validateCronExpression(cron, isQuartz, configOverrides) {
    this.cronValidateConfig.override = {
      useSeconds: isQuartz,
      ...NgxCronService.CRON_VALIDATE_CONFIG_OVERRIDES,
      ...configOverrides
    };

    // coerce cron to string when undefined or null to prevent CronValidate from failing
    if (cron == null) {
      cron = '';
    }

    const cronResult = CronValidate(cron, this.cronValidateConfig);

    if (cronResult.isError()) {
      const [error] = cronResult.getError();
      return { isValid: false, error };
    }
  }

  private validate(data: any, cron, configOverrides) {
    const err = this.validateCronExpression(cron, data.isQuartz, configOverrides);
    if (err) return err;

    if (data.minuteInterval > MAX_MINUTES || data.minuteInterval === 0 || data.minute > MAX_MINUTES) {
      const error = this.secondOrMinutesErrorDescription('minutes', cron);
      return { isValid: false, error };
    }

    if (data.secondInterval > MAX_MINUTES || data.secondInterval === 0) {
      const error = this.secondOrMinutesErrorDescription('seconds', cron);
      return { isValid: false, error };
    }

    const daysMax = data.daysMax;
    if ((daysMax !== null && data.day > daysMax) || data.day > MAX_DAYS_OF_MONTH || data.day === 0) {
      const error = `Day of the month does not exist for current month selected (Input cron: ${cron})`;
      return { isValid: false, error };
    }

    return { isValid: true, error: null };
  }

  private secondOrMinutesErrorDescription(period: 'seconds' | 'minutes', cron) {
    return `Number of ${period} should be between 1 and 59 (Input cron: ${cron})`;
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

  private getTime(expressionParts: string[]): moment.Moment {
    const s = this.getSeconds(expressionParts);
    const h = this.getHour(expressionParts);
    const m = this.getMin(expressionParts);
    return typeof h === 'number' && typeof m === 'number' ? moment.tz([1990, 1, 1, h, m, s || 0], this.timezone) : null;
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
    if (value === undefined || value === '*') {
      return [['*', 1]];
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
