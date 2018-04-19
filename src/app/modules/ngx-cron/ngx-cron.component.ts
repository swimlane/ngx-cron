import { Component, ViewEncapsulation, OnChanges, Input, EventEmitter, Output, HostBinding } from '@angular/core';
import cronstrue from 'cronstrue';
import { CronParser } from './cron';

@Component({
  selector: 'ngx-cron-input',
  templateUrl: './ngx-cron.component.html',
  styleUrls: [ './ngx-cron.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class NgxCronComponent {
  @Input()
  set cron(val: string) {
    this.setCron(val);
    this._cron = val;
    this.cronChange.emit(val);
  }
  get cron(): string {
    return this._cron;
  }

  @Input()
  get allowedPeriods() {
    return this._allowedPeriods;
  }
  set allowedPeriods(val) {
    this._allowedPeriods = val.filter(p => this.periods.includes(p));
    if (!this._allowedPeriods.includes(this.period)) {
      this.period = val[0];
      this._cron = this.getCron();
      this.setDescription(this._cron);
    }
  }

  periods = Object.keys(CronParser.PERIODS);
  dows = CronParser.DOWS;
  months = CronParser.MONTHS;
  predefined = CronParser.PERIODS;

  period = this.periods[0];
  seconds = 0;
  secondInterval = 1;
  min = 0;
  minInterval = 1;
  dow = this.dows[0];
  day = 1;
  month = this.months[0];
  time = CronParser.MIDNIGHT;
  description: string = cronstrue.toString('0 * * * *');

  daysMax = 31;

  @HostBinding('class.invalid')
  invalid = false;

  @Output() cronChange: EventEmitter<any> = new EventEmitter();

  private _cron = '0 * * * *';
  private _allowedPeriods = Object.keys(CronParser.PERIODS);

  changed() {
    this._cron = this.getCron();
    this.setDescription(this._cron);
    this.cronChange.emit(this._cron);
  }

  private setDescription(cron: string) {
    const c = new CronParser(cron);

    if (this.period !== 'Custom') {
      this.period = c.period;
    }

    this.description = c.description;
    this.invalid = !c.valid;
    this.daysMax = c.daysMax || this.daysMax;
  }

  /**
   * Set the component state based on the cron
   */
  private setCron(cron: string) {
    const c = new CronParser(cron);

    if (this.period !== 'Custom') {
      this.period = c.period;
    }

    this.description = c.description;
    this.invalid = !c.valid;

    if (c.valid) {
      this.dow = c.dow || this.dow;
      this.seconds = c.seconds || this.seconds;
      this.secondInterval = c.secondInterval || this.secondInterval;
      this.min = c.min || this.min;
      this.minInterval = c.minInterval || this.minInterval;
      this.time = c.time || this.time;
      this.day = c.day || this.day;
      this.month = c.month || this.month;
      this.daysMax = c.daysMax || 31;
    }
  }

  /**
   * Get the cron string from component state
   * Only used for non-custome periods
   */
  private getCron(): string {
    let r: Array<string | number> = ['', '*', '*', '*', '*', '*'];
    let [seconds, min, hour, day, month, dow]: Array<string | number> = r;
    switch (this.period) {
      case 'Secondly':
        seconds = this.secondInterval === 1 ? '*' : `*/${this.secondInterval}`;
        break;
      case 'Minutely':
        if (+this.minInterval !== 1) {
          min = `*/${this.minInterval}`;
        }
        break;
      case 'Hourly':
        min = this.min;
        break;
      case 'Weekly':
        dow  = this.dows.indexOf(this.dow);
      case 'Daily':
        min  = this.time.getMinutes();
        hour = this.time.getHours();
        break;
      case 'Yearly':
        month = this.months.indexOf(this.month) + 1;
      case 'Monthly':
        min  = this.time.getMinutes();
        hour = this.time.getHours();
        day  = this.day;
        break;
      default:
        return this.cron;
    }
    r = [min, hour, day, month, dow];
    if (seconds) {
      r.unshift(seconds);
    }
    return r.join(' ');
  }
}
