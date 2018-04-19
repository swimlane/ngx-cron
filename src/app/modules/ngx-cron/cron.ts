import { default as ExpressionDescriptor } from 'cronstrue';

// @dynamic
export class CronParser extends ExpressionDescriptor {

  static DOWS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  static MONTHS = ['January', 'February', 'March', 'April',
                'May', 'June', 'July', 'August',
                'September', 'October', 'November', 'December'];

  static PERIODS = {
    Secondly: {cron: '* * * * * *', regex: /^\*(\/\d+)?(\s\*){5}$/ },
    Minutely: {cron: '* * * * *', regex: /^\*(\/\d+)?(\s\*){4}$/ },
    Hourly: {cron: '0 * * * *', regex: /^\d{1,2}\s(\*\s){3}\*$/ },
    Daily: {cron: '0 0 * * *', regex: /^(\d{1,2}\s){2,3}(\*\s){2}\*$/ },
    Weekly: {cron: '0 0 * * 0', regex: /^(\d{1,2}\s){2,3}(\*\s){2}\d{1,2}$/ },
    Monthly: {cron: '0 0 1 * *', regex: /^(\d{1,2}\s){3,4}\*\s\*$/ },
    Yearly: {cron: '0 0 1 1 *', regex: /^(\d{1,2}\s){4,5}\*$/ },
    Custom: {cron: '* * * * *', regex: /^.*$/ }
  };

  static MIDNIGHT = new Date(1990, 1, 1, 0, 0);

  description: string;
  valid = true;

  period: string;
  seconds: number;
  secondInterval: number;
  min: number;
  minInterval: number;
  hour: number;
  day: number;
  time: Date;
  daysMax: number;
  month: string;
  dow: string;

  constructor(cron: string, options = { }) {
    super(cron, { locale: 'en', throwExceptionOnParseError: true, ...options });
    this.setCron(cron);
  }

  private setCron(cron: string) {
    this.expression = cron;
    try {
      this.description = this.getFullDescription();  // for side effects
      this.period = this.getPeriod();
      this.seconds = this.getSeconds();
      this.secondInterval = this.getSecondInterval();
      this.min = this.getMin();
      this.minInterval = this.getMinInterval();
      this.hour = this.getHour();
      this.day = this.getDay();
      this.month = this.getMonth();
      this.daysMax = this.getDaysMax();
      this.time = this.getTime();
      this.valid = this.validate();
    } catch (err) {
      this.description = this.i18n.anErrorOccuredWhenGeneratingTheExpressionD();
      this.valid = false;
    }
  }

  private validate() {
    if (this.min > 59) { return false; }
    if (this.hour > 24) { return false; }
    const daysMax = this.daysMax;
    if (daysMax !== null && this.day > daysMax) { return false; }
    return true;
  }

  private getPeriod(): string {
    for (const [key, value] of (Object as any).entries(CronParser.PERIODS)) {
      if (value.regex.test(this.expression)) { return key; }
    }
    return 'Custom';
  }

  private getSeconds(): number {
    const v = this.getSegment(this.expressionParts[0])[0][0];
    return typeof v === 'number' ? v : null;
  }

  private getSecondInterval(): number {
    const v = this.getSegment(this.expressionParts[0])[0][1];
    return typeof v === 'number' ? v : null;
  }

  private getMin(): number {
    const v = this.getSegment(this.expressionParts[1])[0][0];
    return typeof v === 'number' ? v : null;
  }

  private getMinInterval(): number {
    const v = this.getSegment(this.expressionParts[1])[0][1];
    return typeof v === 'number' ? v : null;
  }

  private getHour(): number {
    const v = this.getSegment(this.expressionParts[2])[0][0];
    return typeof v === 'number' ? v : null;
  }

  private getDay(): number {
    const v = this.getSegment(this.expressionParts[3])[0][0];
    return typeof v === 'number' ? v : null;
  }

  private getTime(): Date {
    const s = this.seconds;
    const h = this.hour;
    const m = this.min;
    return (typeof h === 'number' && typeof m === 'number') ? new Date(1990, 1, 1, h, m, s || 0) : null;
  }

  private getMonth(): string {
    const v = this.getSegment(this.expressionParts[4])[0][0];
    return typeof v === 'number' ? CronParser.MONTHS[v - 1] : null;
  }

  private getDaysMax(): number {
    const v = this.getSegment(this.expressionParts[4])[0][0];
    return typeof v === 'number' ? new Date(2008, v, 0).getDate() : null;
  }

  private getDow(): string {
    const v = this.getSegment(this.expressionParts[5])[0][0];
    return typeof v === 'number' ? CronParser.DOWS[v] : null;
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
